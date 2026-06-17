const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking",
      required: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
      required: true,
    },

    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "agent",
      default: null,
    },

    baseAmount: {
      type: Number,
      default: 0,
    },

    gstRate: {
      type: Number,
      default: 18,
    },

    gstAmount: {
      type: Number,
      default: 0,
    },

    amount: {
      type: Number,
      required: true,
    },

    agentIncome: {
      type: Number,
      default: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },

    transactionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const paymentModel = mongoose.model("payment", paymentSchema);

module.exports = paymentModel;
