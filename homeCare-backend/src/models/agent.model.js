const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        fullName: {
            type: String,
        },
        email: {
            type: String,
        },
        gender: {
            type: String,
            enum: ["male", "female", "others"]
        },
        dob: {
            type: String
        },
        profileLink: {
            type: String
        },
        aadhaarNumber: {
            type: String
        },
        panCardNo: {
            type: String
        },
        aadharPhotoUrl: {
            type: String
        },
        panCardPhotoUrl: {
            type: String
        },
        skills: [{
            type: String
        }],
        experience: {
            type: Number,
            default: 0
        },
        address: [{
            line1: { type: String },
            line2: { type: String },
            city: { type: String },
            state: { type: String },
            pincode: { type: String }
        }],
        documents: [{
            type: { type: String },
            url: { type: String }
        }],
        verificationStatus: {
            type: String,
            enum: ["PENDING", "VERIFIED", "REJECTED"],
            default: "PENDING"
        },
        verifiedAt: {
            type: Date
        },
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'admin'
        },
        isKyc: {
            type: Boolean,
            default: false
        },
        age: {
            type: Number
        },
        isAvailable: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
    }
);

const agentModel = mongoose.model("agent", agentSchema);

module.exports = agentModel;