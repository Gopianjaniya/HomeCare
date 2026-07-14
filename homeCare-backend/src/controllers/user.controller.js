const crypto = require("crypto");
const { generateAccessToken, generateRefreshToken } = require("../middleware/auth.middleware");
const AgentModel = require("../models/agent.model");
const CustomerModel = require("../models/customer.model");
const UserModel = require("../models/user.model");
const { sendVerificationEmail } = require("../utils/email.utils");
const logger = require("../utils/logger");

function authError(res, error) {
    const status = error.statusCode || 500;
    return res
        .status(status)
        .json({ success: false, message: status >= 500 ? "Internal server error" : error.message });
}

function validRole(role) {
    return ["customer", "agent"].includes(role);
}

function normalizedEmail(email) {
    return String(email || "")
        .trim()
        .toLowerCase();
}

function verificationHash(code) {
    return crypto.createHash("sha256").update(code).digest("hex");
}

async function sendEmailCode(user) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailVerificationCode = verificationHash(code);
    user.emailVerificationExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    await sendVerificationEmail({
        email: user.email,
        code,
    });
}

function buildPayload(user, req) {
    return {
        id: user._id.toString(),
        userId: user._id.toString(),
        email: user.email,
        mobile: user.mobile || "",
        role: user.role,
        isActive: user.isActive,
        isFreeze: user.isFreeze,
        isBlock: user.isBlock,
        status: user.status,
        ipAddress: req.ip || req.connection.remoteAddress,
    };
}

exports.signup = async(req, res) => {
    try {
        const email = normalizedEmail(req.body.email);
        const { role, mobile } = req.body;

        if (!email || !validRole(role))
            return res
                .status(400)
                .json({ success: false, message: "A valid email and customer or agent role are required" });
        if (await UserModel.findOne({ email }))
            return res.status(409).json({
                success: false,
                message: "An account already exists for this email. Please log in.",
            });
        const user = await UserModel.create({
            email,
            mobile: mobile || undefined,
            role,
            isProfileCompleted: false,
        });

        try {
            await sendEmailCode(user);
        } catch (error) {
            await UserModel.deleteOne({ _id: user._id });
            throw error;
        }
        return res.status(201).json({
            success: true,
            message: "A 6-digit verification code was sent to your email.",
            data: { email, role },
        });
    } catch (error) {
        logger.error(`Email signup error: ${error.message}`);
        return authError(res, error);
    }
};

exports.login = async(req, res) => {
    try {
        const email = normalizedEmail(req.body.email);
        const { role } = req.body;
        if (!email || !validRole(role))
            return res
                .status(400)
                .json({ success: false, message: "A valid email and customer or agent role are required" });
        const user = await UserModel.findOne({ email, role });
        if (!user)
            return res.status(404).json({
                success: false,
                message: "No account found for this email and role. Please sign up.",
            });
        if (!user.isActive || user.isBlock)
            return res.status(403).json({ success: false, message: "Account is inactive or blocked" });
        await sendEmailCode(user);
        return res.json({
            success: true,
            message: "A 6-digit verification code was sent to your email.",
            data: { email, role },
        });
    } catch (error) {
        logger.error(`Email login error: ${error.message}`);
        return authError(res, error);
    }
};

exports.verifyEmail = async(req, res) => {
    try {
        const email = normalizedEmail(req.body.email);
        const code = String(req.body.code || "").trim();
        const { role } = req.body;
        if (!email || !code || !validRole(role))
            return res.status(400).json({
                success: false,
                message: "Email, role, and 6-digit verification code are required",
            });

        const user = await UserModel.findOne({
            email,
            role,
            emailVerificationCode: verificationHash(code),
            emailVerificationExpiry: { $gt: new Date() },
        });
        if (!user)
            return res.status(401).json({
                success: false,
                message: "This verification code is invalid or has expired. Please request a new one.",
            });
        if (!user.isActive || user.isBlock)
            return res.status(403).json({ success: false, message: "Account is inactive or blocked" });
        const payload = buildPayload(user, req);
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        await UserModel.updateOne({ _id: user._id }, {
            accessToken,
            refreshToken,
            ipAddress: payload.ipAddress,
            emailVerificationCode: null,
            emailVerificationExpiry: null,
        });
        const ProfileModel = user.role === "agent" ? AgentModel : CustomerModel;
        const profile = await ProfileModel.findOne({ userId: user._id });
        if (profile && !user.isProfileCompleted)
            await UserModel.updateOne({ _id: user._id }, { isProfileCompleted: true });
        return res.json({
            success: true,
            message: "Email verified successfully",
            data: {
                isProfileCompleted: Boolean(profile),
                role: user.role,
                userId: user._id,
                profile,
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        logger.error(`Email verification error: ${error.message}`);
        return authError(res, error);
    }
};