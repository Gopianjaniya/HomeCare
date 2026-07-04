const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    mobile: {
        type: String,
        required: true,
        match: /^(\+91|0)?[6789]\d{9}$/,
    },
    email: {
        type: String,
        required: false,
        unique: true,
        sparse: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isFreeze: {
        type: Boolean,
        default: false,
    },
    isBlock: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
        required: true,
    },
    role: {
        type: String,
        enum: ["customer", "agent"],
        required: true,
    },
    ipAddress: {
        type: String,
    },
    accessToken: {
        type: String,
    },
    refreshToken: {
        type: String,
        // required: true
    },
    otp: {
        type: String,
    },
    //   FIX: OTP expiry — 5 minutes ke baad OTP invalid ho jayega
    otpExpiry: {
        type: Date,
        default: null,
    },
    isProfileCompleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

userSchema.index({ mobile: 1, role: 1 }, { unique: true });

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
