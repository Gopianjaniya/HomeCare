const userRoutes = require("express").Router();
const userController = require("../controllers/user.controller");
// const { authenticate } = require("../middleware/auth.middleware");

// Public routes (no authentication required)
userRoutes.post("/signup", userController.signup);
userRoutes.post("/login", userController.login);
userRoutes.post("/resend-otp", userController.resendOtp);
userRoutes.post("/verify-otp", userController.verifyOtp);


module.exports = userRoutes;
