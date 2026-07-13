const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    mobile: {
        type: String,
        required: false,
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
    emailVerificationCode: {
        type: String,
    },
    emailVerificationExpiry: {
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

// A sparse compound index still indexes a `null` mobile number, so it prevents
// more than one email-only account per role. Index only real phone numbers.
userSchema.index(
    { mobile: 1, role: 1 },
    { unique: true, partialFilterExpression: { mobile: { $type: "string" } } }
);

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
