const paymentModel = require("../../models/payment.model");
const bookingModel = require("../../models/booking.model");
const logger = require("../../utils/logger");

const GST_RATE = 18;

function roundMoney(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

exports.createPayment = async (req, res) => {
  try {
    logger.info("createPayment api called");

    const { bookingId, customerId, paymentMethod } = req.body;

    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "booking not found",
      });
    }

    const baseAmount = roundMoney(booking.price);
    const gstAmount = roundMoney((baseAmount * GST_RATE) / 100);
    const totalAmount = roundMoney(baseAmount + gstAmount);

    const payment = await paymentModel.create({
      bookingId,
      customerId,
      agentId: booking.agentId || null,
      baseAmount,
      gstRate: GST_RATE,
      gstAmount,
      amount: totalAmount,
      agentIncome: baseAmount,
      paymentMethod,
      paymentStatus: "SUCCESS",
      transactionId: `TXN${Date.now()}`,
    });

    return res.status(201).json({
      success: true,
      message: "payment successful",
      data: payment,
    });
  } catch (error) {
    logger.error("Error", error);

    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await paymentModel
      .find()
      .populate("bookingId")
      .populate("customerId")
      .populate("agentId");

    return res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    logger.error("Error", error);

    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
