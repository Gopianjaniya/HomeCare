const bookingRoutes = require("express").Router();

const bookingController = require("../../controllers/booking/booking.controller");
const { authenticate, authorizeRoles } = require("../../middleware/auth.middleware");

// Middleware groups
const authUser = authenticate({ fetchUserFromDB: true });
const adminOnly = [authenticate({ fetchUserFromDB: false }), authorizeRoles("admin")];
const agentOnly = [authenticate({ fetchUserFromDB: true }), authorizeRoles("agent")];

// ⚠️  IMPORTANT: Specific routes MUST come BEFORE wildcard /:bookingId
// Warna Express /customer/xyz aur /agent/xyz ko bookingId samajh leta hai

// Create booking — auth required (anonymous users block)
bookingRoutes.post("/create", authUser, bookingController.createBooking);

// Admin — get all bookings
bookingRoutes.get("/all", adminOnly, bookingController.getAllBookings);

//   FIX: Customer bookings — PEHLE aana chahiye /:bookingId se
bookingRoutes.get("/customer/:customerId", bookingController.getCustomerBookings);

//   FIX: Agent bookings — PEHLE aana chahiye /:bookingId se
bookingRoutes.get("/agent/:agentId", bookingController.getAgentBookings);

// Get single booking by ID — wildcard, SABSE LAST me
bookingRoutes.get("/:bookingId", bookingController.getBookingById);

// Booking status update routes
bookingRoutes.patch("/accept/:bookingId", agentOnly, bookingController.acceptBooking);

bookingRoutes.patch("/reject/:bookingId", bookingController.rejectBooking);

bookingRoutes.patch("/start/:bookingId", bookingController.startBooking);

bookingRoutes.patch("/complete/:bookingId", bookingController.completeBooking);

bookingRoutes.patch("/cancel/:bookingId", bookingController.cancelBooking);

module.exports = bookingRoutes;