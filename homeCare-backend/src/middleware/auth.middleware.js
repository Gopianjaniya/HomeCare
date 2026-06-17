const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const logger = require("../utils/logger");

const generateAccessToken = (payload, expiresIn = "24h") => {
  try {
    const secret = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET_KEY or JWT_SECRET environment variable is not set");
    }
    const token = jwt.sign(payload, secret, { expiresIn });
    return token;
  } catch (error) {
    logger.error("Error generating access token", error);
    throw error;
  }
};

const generateRefreshToken = (payload, expiresIn = "7d") => {
  try {
    const secret = process.env.JWT_REFRESH_SECRET_KEY || process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_REFRESH_SECRET_KEY or JWT_SECRET environment variable is not set");
    }
    const token = jwt.sign(payload, secret, { expiresIn });
    return token;
  } catch (error) {
    logger.error("Error generating refresh token", error);
    throw error;
  }
};

const verifyToken = (token, isRefreshToken = false) => {
  try {
    const secret = isRefreshToken
      ? process.env.JWT_REFRESH_SECRET_KEY || process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET_KEY || process.env.JWT_SECRET
      : process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT secret key is not configured");
    }

    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    } else {
      throw error;
    }
  }
};

const authenticate = (options = {}) => {
  const { fetchUserFromDB = true, requireActive = true } = options;

  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: "Authorization header is missing",
        });
      }

      // Check if token format is correct (Bearer <token>)
      const parts = authHeader.split(" ");
      if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: "Invalid authorization header format. Use: Bearer <token>",
        });
      }

      const token = parts[1];

      // Verify token
      let decoded;
      try {
        decoded = verifyToken(token);
        logger.info(`Token verified successfully for user: ${decoded.userId || decoded.id}`);
      } catch (error) {
        logger.error(`Token verification failed: ${error.message}, Token: ${token.substring(0, 20)}...`);
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: error.message || "Invalid or expired token",
        });
      }

      // If fetchUserFromDB is true, get user from database
      if (fetchUserFromDB) {
        const user = await UserModel.findById(decoded.userId || decoded.id).select("-otp -__v");

        if (!user) {
          return res.status(401).json({
            success: false,
            statusCode: 401,
            message: "User not found",
          });
        }

        // Check if user is active (if required)
        if (requireActive) {
          if (!user.isActive || user.isBlock || user.isFreeze || user.status !== "active") {
            return res.status(403).json({
              success: false,
              statusCode: 403,
              message: "User account is not active or has been blocked",
            });
          }
        }

        // Attach user information to request object
        req.user = {
          id: user._id.toString(),
          userId: user._id.toString(),
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          isActive: user.isActive,
          isFreeze: user.isFreeze,
          isBlock: user.isBlock,
          status: user.status,
          ipAddress: user.ipAddress,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      } else {
        // If not fetching from DB, use decoded token data
        req.user = {
          id: decoded.userId || decoded.id,
          userId: decoded.userId || decoded.id,
          email: decoded.email,
          mobile: decoded.mobile,
          role: decoded.role,
          ...decoded,
        };
      }

      // Continue to next middleware
      next();
    } catch (error) {
      logger.error("Error in authentication middleware", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal server error during authentication",
      });
    }
  };
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "You are not allowed to access this resource",
      });
    }

    next();
  };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  authenticate,
  authorizeRoles,
};
