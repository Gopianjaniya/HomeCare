const { model } = require("mongoose");
const agentModel = require("../../models/agent.model");
const UserModel = require("../../models/user.model");
const logger = require("../../utils/logger");
const serviceModel = require("../../models/service.model");
const bookingModel = require("../../models/booking.model");
const paymentModel = require("../../models/payment.model");
const { messaging } = require("firebase-admin");

function roundMoney(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function normalizeSkills(skills) {
  const values = Array.isArray(skills) ? skills : [skills];
  return values
    .flatMap((skill) => String(skill || "").split(","))
    .map((skill) => skill.trim().replace(/\s+/g, " ").toLowerCase())
    .filter(Boolean);
}

exports.agentProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { fullName, email, gender, dob, skills } = req.body;
    let profileLink = null;
    if (req.file) {
      profileLink = `/uploads/${req.file.filename}`;
    }
    const updateData = { userId };
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (gender) updateData.gender = gender;
    if (dob) updateData.dob = dob;
    if (profileLink) updateData.profileLink = profileLink;
    const nextSkills = normalizeSkills(skills);
    if (!nextSkills.length) {
      return res.status(400).json({
        success: false,
        message: "please select at least one service skill",
      });
    }
    updateData.skills = nextSkills;

    const userProfile = await agentModel.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    if (!userProfile) {
      return res.status(500).json({ success: false, message: "failed to create agent profile" });
    }
    await UserModel.findByIdAndUpdate(userId, { isProfileCompleted: true });

    return res
      .status(200)
      .json({ success: true, message: "agent profile created successfully", data: userProfile });
  } catch (error) {
    logger.error("Error", error);
    return res.status(500).json({ success: false, message: "internal server error" });
  }
};
exports.updateAgentProfile = async (req, res, next) => {
  try {
    const { agentId } = req.params;
    const agent = await agentModel.findById(agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "agent not found",
      });
    }

    if (req.body.fullName) agent.fullName = req.body.fullName;
    if (req.body.email) agent.email = req.body.email;
    if (req.body.dob) agent.dob = req.body.dob;
    if (req.body.gender) agent.gender = req.body.gender;
    if (req.body.skills !== undefined) {
      const nextSkills = normalizeSkills(req.body.skills);
      if (!nextSkills.length) {
        return res.status(400).json({
          success: false,
          message: "please select at least one service skill",
        });
      }
      agent.skills = nextSkills;
    }


     if (req.file) {
      agent.profileLink = `/uploads/${req.file.filename}`;
    }

    await agent.save();

    return res.status(200).json({
      success: true,
      message: "user profile updated successfully",
      data: agent,
    });
  } catch (error) {
    logger.error("Error", error);
    return res.status(500).json({ success: false, message: "internal server error" });
  }
};

exports.agentAddresses = async (req, res, next) => {
  try {
    const { agentId } = req.params;
    const { line1, line2, city, state, pincode } = req.body;
    const agent = await agentModel.findOne({ _id: agentId });

    if (!agent) {
      return res.status(404).json({ success: false, message: "user not found" });
    }
    if (!agent.address) {
      agent.address = [];
      return res.status(404).json({
        success: false,
        message: "you have no address for update",
      });
    }
    agent.address.push({ line1, line2, city, state, pincode });
    await agent.save();
    return res
      .status(200)
      .json({ success: true, message: "Address added successfully", data: agent.address });
  } catch (error) {
    logger.error("error", error);
    return res.status(500).json({ success: false, message: "internal server error" });
  }
};

exports.updateAgentAddress = async (req, res, next) => {
  try {
    const { agentId, addressId } = req.params;
    const { line1, line2, city, state, pincode } = req.body;

    const updateFields = {};

    if (line1) updateFields["address.$.line1"] = line1;
    if (line2) updateFields["address.$.line2"] = line2;
    if (city) updateFields["address.$.city"] = city;
    if (state) updateFields["address.$.state"] = state;
    if (pincode) updateFields["address.$.pincode"] = pincode;

    const agentUpdateAdresses = await agentModel.findOneAndUpdate(
      { _id: agentId, "address._id": addressId },
      { $set: updateFields },
      { new: true }
    );

    if (!agentUpdateAdresses) {
      return res.status(404).json({
        success: false,
        message: "agent address not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "agent address updated successfully",
      data: agentUpdateAdresses,
    });
  } catch (error) {
    logger.error("Error", error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

exports.deleteAgentAdress = async (req, res) => {
  try {
    logger.info("deleteAgentAddress api called")
    const {agentId, addressId} = req.params
    const agent = await agentModel.findById(agentId)
    if(!agent) {
      return res.status(404).json({
      success: false,
      message: "agent not found"
    })
  }
    const address = agent.address.id(addressId)
    if(!address) {
      return res.status(404).json({
        success: false,
        message: "address not found"
      })
    }
    agent.address.pull(addressId)
    await agent.save();

    return res.status(200).json({
      success: true,
      message: "agent address deleted successfully",
      data: agent.address
    })
  } catch (error) {
    logger.error("Error",error)
    return res.status(500).json({
      success: false,
      message: "internal server error"
    })
  }
}

exports.getAgentWallet = async (req, res) => {
  try {
    logger.info("getAgentWallet api called");

    const { agentId } = req.params;
    const agent = await agentModel.findById(agentId);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "agent not found",
      });
    }

    const completedBookings = await bookingModel
      .find({ agentId, status: "COMPLETED" })
      .populate("customerId")
      .sort({ completedAt: -1, updatedAt: -1 });

    const bookingIds = completedBookings.map((booking) => booking._id);
    const payments = await paymentModel
      .find({ bookingId: { $in: bookingIds }, paymentStatus: "SUCCESS" })
      .lean();

    const paymentsByBookingId = new Map(
      payments.map((payment) => [String(payment.bookingId), payment])
    );

    const history = completedBookings.map((booking) => {
      const payment = paymentsByBookingId.get(String(booking._id));
      const baseAmount = roundMoney(payment?.baseAmount ?? booking.price);
      const gstRate = Number(payment?.gstRate ?? 18);
      const gstAmount = roundMoney(payment?.gstAmount ?? (baseAmount * gstRate) / 100);
      const totalAmount = roundMoney(payment?.amount ?? baseAmount + gstAmount);
      const agentIncome = roundMoney(payment?.agentIncome ?? baseAmount);

      return {
        bookingId: booking._id,
        bookingCode: booking.bookingId,
        serviceName: booking.serviceName,
        variantName: booking.variantName,
        customerName: booking.customerId?.fullName || "Customer",
        completedAt: booking.completedAt,
        baseAmount,
        gstRate,
        gstAmount,
        totalAmount,
        agentIncome,
        paymentStatus: payment?.paymentStatus || "PENDING",
        paymentMethod: payment?.paymentMethod || "N/A",
        transactionId: payment?.transactionId || "",
      };
    });

    const paidHistory = history.filter((item) => item.paymentStatus === "SUCCESS");
    const totals = paidHistory.reduce(
      (sum, item) => ({
        totalServicesRepaired: sum.totalServicesRepaired + 1,
        walletBalance: roundMoney(sum.walletBalance + item.agentIncome),
        totalGst: roundMoney(sum.totalGst + item.gstAmount),
        totalCollection: roundMoney(sum.totalCollection + item.totalAmount),
      }),
      {
        totalServicesRepaired: 0,
        walletBalance: 0,
        totalGst: 0,
        totalCollection: 0,
      }
    );

    return res.status(200).json({
      success: true,
      message: "agent wallet fetched successfully",
      data: {
        ...totals,
        history,
      },
    });
  } catch (error) {
    logger.error("Error", error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
