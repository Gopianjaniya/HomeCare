const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
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

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service",
      required: true,
    },

    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    serviceName: {
      type: String,
    },

    variantName: {
      type: String,
    },

    bookingDate: {
      type: String,
      required: true,
    },

    bookingTime: {
      type: String,
      required: true,
    },

    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
    },

    price: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "ACCEPTED",
        "REJECTED",
        "ONGOING",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "PENDING",
    },

    cancelReason: {
      type: String,
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.pre("save", function (next) {
  if (!this.bookingId) {
    this.bookingId = `BK${Date.now()}`;
  }
  next();
});

const bookingModel = mongoose.model("booking", bookingSchema);

module.exports = bookingModel;