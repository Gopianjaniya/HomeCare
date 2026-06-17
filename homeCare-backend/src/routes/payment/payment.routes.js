const paymentRoutes = require("express").Router();

const paymentController = require("../../controllers/payment/payment.controller");
const { authenticate, authorizeRoles } = require("../../middleware/auth.middleware");

// Middleware groups
const authUser = authenticate({ fetchUserFromDB: true });
const adminOnly = [authenticate({ fetchUserFromDB: false }), authorizeRoles("admin")];

//   FIX: Payment create — auth required (anonymous users block)
paymentRoutes.post("/create", authUser, paymentController.createPayment);

// Admin — get all payments
paymentRoutes.get("/all", adminOnly, paymentController.getPayments);

module.exports = paymentRoutes;