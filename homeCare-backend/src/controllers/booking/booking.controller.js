const bookingModel = require("../../models/booking.model");
const CustomerModel = require("../../models/customer.model");
const agentModel = require("../../models/agent.model");
const serviceModel = require("../../models/service.model");
const logger = require("../../utils/logger");

function normalizeName(value = "") {
  return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function agentCanHandleService(agent, serviceName) {
  const agentSkills = new Set((agent.skills || []).map(normalizeName));
  return agentSkills.has(normalizeName(serviceName));
}

function coordinates(location) {
  const latitude = Number(location?.latitude);
  const longitude = Number(location?.longitude);
  return Number.isFinite(latitude) && Number.isFinite(longitude)
    ? { latitude, longitude }
    : null;
}

function distanceInKm(from, to) {
  const origin = coordinates(from);
  const destination = coordinates(to);
  if (!origin || !destination) return Number.POSITIVE_INFINITY;

  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(destination.latitude - origin.latitude);
  const longitudeDelta = toRadians(destination.longitude - origin.longitude);
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(toRadians(origin.latitude))
      * Math.cos(toRadians(destination.latitude))
      * Math.sin(longitudeDelta / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function closestAgentDistance(agent, customerLocation) {
  return (agent.address || []).reduce(
    (closest, address) => Math.min(closest, distanceInKm(customerLocation, address.location)),
    Number.POSITIVE_INFINITY,
  );
}

const OFFER_WINDOW_MS = 60 * 1000;

async function advanceExpiredOffer(booking) {
  if (booking.status !== "PENDING" || !booking.offerExpiresAt || booking.offerExpiresAt > new Date()) return booking;
  const nextIndex = booking.offerIndex + 1;
  const nextAgentId = booking.offerQueue[nextIndex];
  const update = nextAgentId
    ? { agentId: nextAgentId, offerIndex: nextIndex, offerExpiresAt: new Date(Date.now() + OFFER_WINDOW_MS) }
    : { status: "REJECTED", agentId: null, offerExpiresAt: null };
  const advanced = await bookingModel.findOneAndUpdate(
    { _id: booking._id, status: "PENDING", offerIndex: booking.offerIndex, offerExpiresAt: { $lte: new Date() } },
    { $set: update }, { new: true }
  );
  return advanced || booking;
}

async function eligibleAgentQueue(serviceName, customerLocation) {
  // The agent profile is the source of truth for the services an agent can do.
  // Requiring a separate approved service record meant a newly created agent was
  // never eligible, even when they were the only available matching agent.
  const agents = await agentModel.find({ isAvailable: true });
  const candidates = agents
    .filter((agent) => agentCanHandleService(agent, serviceName))
    .map((agent) => ({
      agentId: agent._id,
      distance: closestAgentDistance(agent, customerLocation),
    }));
  return candidates
    .sort((a, b) => a.distance - b.distance || String(a.agentId).localeCompare(String(b.agentId)))
    .map((candidate) => candidate.agentId);
}

// Advance timed-out offers even when the previously offered agent never refreshes.
// The conditional update in advanceExpiredOffer makes concurrent worker/API calls safe.
const offerScheduler = setInterval(async () => {
  try {
    const expired = await bookingModel.find({ status: "PENDING", offerExpiresAt: { $lte: new Date() } }).limit(100);
    await Promise.all(expired.map(advanceExpiredOffer));
  } catch (error) {
    logger.error(`Offer scheduler error: ${error.message}`);
  }
}, 5000);
offerScheduler.unref?.();

exports.createBooking = async (req, res) => {
  try {
    logger.info("createBooking api called");

    const {
      customerId,
      serviceId,
      variantId,
      bookingDate,
      bookingTime,
      addressId,
    } = req.body;

    const customer = await CustomerModel.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "customer not found",
      });
    }

    const service = await serviceModel.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "service not found",
      });
    }

    const variant = service.variants.id(variantId);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "variant not found",
      });
    }

    const customerAddress = customer.address.id(addressId);

    if (!customerAddress) {
      return res.status(404).json({
        success: false,
        message: "address not found",
      });
    }

    const bookingPrice = Number(variant.variantPrice);
    if (!Number.isFinite(bookingPrice) || bookingPrice <= 0) {
      return res.status(400).json({ success: false, message: "selected service has an invalid price" });
    }

    // Pricing is always the exact variant selected by the customer. Agent pricing
    // never influences routing or changes an already selected booking price.
    const offerQueue = await eligibleAgentQueue(service.categoryName, customerAddress.location);
    const booking = await bookingModel.create({
      customerId,
      agentId: offerQueue[0] || null,
      serviceId,
      variantId,
      serviceName: service.categoryName,
      variantName: variant.variantName,
      bookingDate,
      bookingTime,
      address: customerAddress,
      price: bookingPrice,
      status: "PENDING",
      offerQueue,
      offerIndex: 0,
      offerExpiresAt: offerQueue.length ? new Date(Date.now() + OFFER_WINDOW_MS) : null,
    });

    return res.status(201).json({
      success: true,
      message: "booking created successfully",
      data: booking,
    });
  } catch (error) {
    logger.error("Error", error);

    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    logger.info("getAllBookings api called");

    const bookings = await bookingModel
      .find()
      .populate("customerId")
      .populate("agentId")
      .populate("serviceId");

    return res.status(200).json({
      success: true,
      message: "bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
    logger.error("Error", error);

    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    logger.info("getBookingById api called");

    const { bookingId } = req.params;

    const booking = await bookingModel
      .findById(bookingId)
      .populate("customerId")
      .populate("agentId")
      .populate("serviceId");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "booking fetched successfully",
      data: booking,
    });
  } catch (error) {
    logger.error("Error", error);

    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

exports.getCustomerBookings = async (req, res) => {
  try {
    logger.info("getCustomerBookings api called");

    const { customerId } = req.params;

    const bookings = await bookingModel
      .find({ customerId })
      .populate("agentId")
      .populate("serviceId");

    return res.status(200).json({
      success: true,
      message: "customer bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
    logger.error("Error", error);

    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

exports.getAgentBookings = async (req, res) => {
  try {
    logger.info("getAgentBookings api called");

    const { agentId } = req.params;
    const agent = await agentModel.findById(agentId);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "agent not found",
      });
    }

    const pendingOffers = await bookingModel.find({ agentId, status: "PENDING", offerExpiresAt: { $lte: new Date() } });
    await Promise.all(pendingOffers.map(advanceExpiredOffer));
    const bookings = await bookingModel
      .find({ agentId })
      .populate("customerId")
      .populate("serviceId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "agent bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
    logger.error("Error", error);

    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

exports.acceptBooking = async (req, res) => {
  try {
    logger.info("acceptBooking api called");

    const { bookingId } = req.params;
    const requestedAgentId = req.body.agentId;

    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "booking not found",
      });
    }

    const agent = await agentModel.findOne({ userId: req.user.userId || req.user.id });
    const agentId = agent?._id;

    if (!agentId) {
      return res.status(400).json({
        success: false,
        message: "agent profile is required",
      });
    }

    if (requestedAgentId && String(requestedAgentId) !== String(agentId)) {
      return res.status(403).json({
        success: false,
        message: "you can accept bookings only for your own agent profile",
      });
    }

    await advanceExpiredOffer(booking);
    const currentBooking = await bookingModel.findById(bookingId);
    if (currentBooking.status !== "PENDING" || String(currentBooking.agentId) !== String(agentId) || !currentBooking.offerExpiresAt || currentBooking.offerExpiresAt <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "This booking is no longer available for you.",
      });
    }

    const serviceName = currentBooking.serviceName || (await serviceModel.findById(currentBooking.serviceId))?.categoryName;
    if (!agentCanHandleService(agent, serviceName)) {
      return res.status(403).json({
        success: false,
        message: "you can accept only bookings matching your selected services",
      });
    }

    const reservation = await agentModel.updateOne({ _id: agentId, isAvailable: true }, { $set: { isAvailable: false } });
    if (!reservation.modifiedCount) return res.status(409).json({ success: false, message: "You are busy with another booking." });
    const accepted = await bookingModel.findOneAndUpdate(
      { _id: bookingId, status: "PENDING", agentId, offerExpiresAt: { $gt: new Date() } },
      { $set: { status: "ACCEPTED", offerExpiresAt: null } }, { new: true }
    );
    if (!accepted) {
      await agentModel.updateOne({ _id: agentId }, { $set: { isAvailable: true } });
      return res.status(409).json({ success: false, message: "This booking was already assigned or its offer expired." });
    }

    return res.status(200).json({
      success: true,
      message: "booking accepted successfully",
      data: accepted,
    });
  } catch (error) {
    logger.error("Error", error);

    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

exports.rejectBooking = async (req, res) => {
  try {
    logger.info("rejectBooking api called");

    const { bookingId } = req.params;

    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "booking not found",
      });
    }

    const agent = await agentModel.findOne({ userId: req.user.userId || req.user.id });
    if (!agent || String(booking.agentId) !== String(agent._id) || booking.status !== "PENDING") {
      return res.status(403).json({ success: false, message: "This booking is not currently offered to you." });
    }
    const nextIndex = booking.offerIndex + 1;
    const nextAgentId = booking.offerQueue[nextIndex];
    const updated = await bookingModel.findOneAndUpdate(
      { _id: bookingId, status: "PENDING", agentId: agent._id, offerIndex: booking.offerIndex },
      { $set: nextAgentId ? { agentId: nextAgentId, offerIndex: nextIndex, offerExpiresAt: new Date(Date.now() + OFFER_WINDOW_MS) } : { status: "REJECTED", agentId: null, offerExpiresAt: null } },
      { new: true }
    );
    if (!updated) return res.status(409).json({ success: false, message: "This booking offer has changed." });

    return res.status(200).json({
      success: true,
      message: "booking rejected successfully",
      data: updated,
    });
  } catch (error) {
    logger.error("Error", error);

    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

exports.startBooking = async (req, res) => {
  try {
    logger.info("startBooking api called");

    const { bookingId } = req.params;

    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "booking not found",
      });
    }

    booking.status = "ONGOING";

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "booking started successfully",
      data: booking,
    });
  } catch (error) {
    logger.error("Error", error);

    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

exports.completeBooking = async (req, res) => {
  try {
    logger.info("completeBooking api called");

    const { bookingId } = req.params;

    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "booking not found",
      });
    }

    booking.status = "COMPLETED";
    booking.completedAt = new Date();

    await booking.save();

    if (booking.agentId) {
      await agentModel.findByIdAndUpdate(booking.agentId, {
        isAvailable: true,
      });
    }

    return res.status(200).json({
      success: true,
      message: "booking completed successfully",
      data: booking,
    });
  } catch (error) {
    logger.error("Error", error);

    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    logger.info("cancelBooking api called");

    const { bookingId } = req.params;
    const { cancelReason } = req.body;

    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "booking not found",
      });
    }

    booking.status = "CANCELLED";
    booking.cancelReason = cancelReason;

    await booking.save();

    if (booking.agentId) {
      await agentModel.findByIdAndUpdate(booking.agentId, {
        isAvailable: true,
      });
    }

    return res.status(200).json({
      success: true,
      message: "booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    logger.error("Error", error);

    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
}
