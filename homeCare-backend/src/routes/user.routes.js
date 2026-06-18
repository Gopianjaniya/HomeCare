const userRoutes = require("express").Router();
const userController = require("../controllers/user.controller");
// const { authenticate } = require("../middleware/auth.middleware");
userRoutes.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Auth routes working",
    });
});
// Public routes (no authentication required)
userRoutes.post("/signup", userController.signup);
userRoutes.post("/login", userController.login);
userRoutes.post("/resend-otp", userController.resendOtp);
userRoutes.post("/verify-otp", userController.verifyOtp);

module.exports = userRoutes;