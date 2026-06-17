const { generateAccessToken, generateRefreshToken } = require("../../middleware/auth.middleware");
const logger = require("../../utils/logger");

exports.adminLogin = async (req, res) => {
  try {
    logger.info("adminLogin api called");

    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "").trim();
    const adminEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const adminPassword = String(process.env.ADMIN_PASSWORD || "").trim();

    if (!adminEmail || !adminPassword) {
      return res.status(500).json({
        success: false,
        message: "Admin credentials are not configured",
      });
    }

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    const payload = {
      id: "speedu-admin",
      userId: "speedu-admin",
      email: adminEmail,
      role: "admin",
      status: "active",
      isActive: true,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      data: {
        role: "admin",
        email: adminEmail,
        accessToken,
        refreshToken,
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
