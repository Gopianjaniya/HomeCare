const { generateAccessToken, generateRefreshToken } = require("../middleware/auth.middleware");
const AgentModel = require("../models/agent.model");
const CustomerModel = require("../models/customer.model");
const UserModel = require("../models/user.model");
const { generateOtp } = require("../utils/common.utils");
const logger = require("../utils/logger");
const { sendOtpSms } = require("../utils/sms.utils");

/*
Signup API - Only mobile and role required
Generates static OTP and returns it in response
*/
exports.signup = async(req, res) => {
    try {
        logger.info("SignUp API called .....");
        const { mobile, role } = req.body;

        if (!mobile || !role) {
            return res.status(400).json({
                success: false,
                message: "Mobile number and role are required",
            });
        }

        // Validate role
        if (!["customer", "agent"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Must be 'customer' or 'agent'",
            });
        }

        // Validate mobile format (10 digits)
        if (!/^[6789]\d{9}$/.test(mobile)) {
            return res.status(400).json({
                success: false,
                message: "Invalid mobile number format",
            });
        }

        const formattedMobile = `+91${mobile}`;
        const isExist = await UserModel.findOne({ mobile: formattedMobile });

        if (isExist) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this mobile number",
            });
        }

        // Generate OTP with 5-minute expiry
        const otp = generateOtp(6);
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

        // Create new user with OTP
        const user = await UserModel.create({
            mobile: formattedMobile,
            role,
            otp,
            otpExpiry,
            isProfileCompleted: false,
        });

        // await sendOtpSms(formattedMobile, otp);

        // | FIX: Production me OTP log nahi karna chahiye
        if (process.env.NODE_ENV !== "production") {
            logger.info(`New user created: ${user._id} with mobile: ${formattedMobile}, OTP: ${otp}`);
        } else {
            logger.info(`New user created: ${user._id} with mobile: ${formattedMobile}`);
        }

        return res.status(201).json({
            success: true,
            message: "OTP sent successfully. Please verify to continue.",
            data: {
                mobile: user.mobile,
                role: user.role,
                // | Only return OTP in development mode
                ...(process.env.NODE_ENV !== "production" && { otp }),
            },
        });
    } catch (error) {
        logger.error(`[Error] while sign-up: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

/*
Login API - Only mobile and role required
Generates static OTP and returns it in response
*/
exports.login = async(req, res) => {
    try {
        logger.info("Login API called .....");
        const { mobile, role } = req.body;

        if (!mobile || !role) {
            return res.status(400).json({
                success: false,
                message: "Mobile number and role are required",
            });
        }

        // Validate role
        if (!["customer", "agent"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Must be 'customer' or 'agent'",
            });
        }

        // Validate mobile format
        if (!/^[6789]\d{9}$/.test(mobile)) {
            return res.status(400).json({
                success: false,
                message: "Invalid mobile number format",
            });
        }

        const formattedMobile = `+91${mobile}`;
        const user = await UserModel.findOne({ mobile: formattedMobile });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please sign up first.",
            });
        }

        // Check if role matches
        if (user.role !== role) {
            return res.status(403).json({
                success: false,
                message: "Invalid role for this user",
            });
        }

        // Generate new OTP with 5-minute expiry
        const otp = generateOtp(6);
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
        await UserModel.updateOne({ mobile: formattedMobile }, { otp, otpExpiry });
        await sendOtpSms(formattedMobile, otp);

        // | FIX: Production me OTP log nahi karna chahiye
        if (process.env.NODE_ENV !== "production") {
            logger.info(`User login attempt: ${user._id} with mobile: ${formattedMobile}, OTP: ${otp}`);
        } else {
            logger.info(`User login attempt: ${user._id} with mobile: ${formattedMobile}`);
        }

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully. Please verify to continue.",
            data: {
                mobile: user.mobile,
                role: user.role,
                // | Only return OTP in development mode
                ...(process.env.NODE_ENV !== "production" && { otp }),
            },
        });
    } catch (error) {
        logger.error(`[Error] while login: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.resendOtp = async(req, res) => {
    try {
        logger.info("Resend OTP API called .....");
        const { mobile, role } = req.body;

        if (!mobile || !role) {
            return res.status(400).json({
                success: false,
                message: "Mobile number and role are required",
            });
        }

        if (!["customer", "agent"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Must be 'customer' or 'agent'",
            });
        }

        if (!/^[6789]\d{9}$/.test(mobile)) {
            return res.status(400).json({
                success: false,
                message: "Invalid mobile number format",
            });
        }

        const formattedMobile = `+91${mobile}`;
        const user = await UserModel.findOne({ mobile: formattedMobile });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please sign up first.",
            });
        }

        if (user.role !== role) {
            return res.status(403).json({
                success: false,
                message: "Invalid role for this user",
            });
        }

        const otp = generateOtp(6);
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        await UserModel.updateOne({ _id: user._id }, { otp, otpExpiry });
        await sendOtpSms(formattedMobile, otp);

        if (process.env.NODE_ENV !== "production") {
            logger.info(`OTP resent for user: ${user._id}, OTP: ${otp}`);
        } else {
            logger.info(`OTP resent for user: ${user._id}`);
        }

        return res.status(200).json({
            success: true,
            message: "OTP resent successfully.",
            data: {
                mobile: user.mobile,
                role: user.role,
                ...(process.env.NODE_ENV !== "production" && { otp }),
            },
        });
    } catch (error) {
        logger.error(`[Error] while resending OTP: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Verify OTP - Verify static OTP
/*
1. Verify static OTP
2. Check if user exists
3. Check if profile is completed
4. Generate JWT tokens
5. Send welcome email if new user
6. Send profile completion email if profile not completed
*/
exports.verifyOtp = async(req, res) => {
    try {
        logger.info(`Verify OTP API called.`);

        const { otp, mobile, role } = req.body;

        if (!otp || !mobile || !role) {
            return res.status(400).json({
                success: false,
                message: "OTP, mobile number, and role are required",
            });
        }

        const formattedMobile = `+91${mobile}`;
        const user = await UserModel.findOne({ mobile: formattedMobile });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please sign up first.",
            });
        }

        // Check role match
        if (user.role !== role) {
            return res.status(403).json({
                success: false,
                message: "Invalid role for this user",
            });
        }

        // | FIX: OTP expiry check — 5 minutes ke baad invalid
        if (user.otpExpiry && new Date() > new Date(user.otpExpiry)) {
            return res.status(401).json({
                success: false,
                message: "OTP has expired. Please request a new one.",
            });
        }

        // Verify OTP value
        if (user.otp !== otp) {
            return res.status(401).json({
                success: false,
                message: "Invalid OTP. Please check and try again.",
            });
        }

        // Check user status
        if (!user.isActive || user.isBlock) {
            return res.status(403).json({
                success: false,
                message: "Account is inactive or blocked",
            });
        }

        // Generate JWT tokens
        const payload = {
            id: user._id.toString(),
            userId: user._id.toString(),
            email: user.email || "",
            mobile: user.mobile,
            role: user.role,
            isActive: user.isActive,
            isFreeze: user.isFreeze,
            isBlock: user.isBlock,
            status: user.status,
            ipAddress: req.ip || req.connection.remoteAddress,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        // | FIX: Clear OTP + otpExpiry after successful verification
        await UserModel.updateOne({ _id: user._id }, { accessToken, refreshToken, ipAddress: payload.ipAddress, otp: null, otpExpiry: null });

        logger.info(`OTP verified successfully for user: ${user._id}`);

        const ProfileModel = user.role === "agent" ? AgentModel : CustomerModel;
        const profile = await ProfileModel.findOne({ userId: user._id });
        const hasProfile = Boolean(profile);

        if (hasProfile && !user.isProfileCompleted) {
            await UserModel.findByIdAndUpdate(user._id, { isProfileCompleted: true });
        }

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            data: {
                isProfileCompleted: hasProfile,
                role: user.role,
                userId: user._id,
                profile,
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        logger.error(`Error in verify OTP: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};