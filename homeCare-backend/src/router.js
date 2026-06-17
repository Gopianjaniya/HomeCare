const mainRouter = require("express").Router();
const userRoutes = require("./routes/user.routes");
const customerRoutes = require("./routes/customer/customer.routes");
const agentRoutes = require("./routes/agent/agent.routes");
const serviceRoutes = require("./routes/service/service.routes");
// const uploadRoutes = require("./middleware/upload.middleware");
const bookingRoutes = require("./routes/booking/booking.routes");
const paymentRoutes = require("./routes/payment/payment.routes");
const adminRoutes = require("./routes/admin/admin.routes");


mainRouter.use("/auth", userRoutes);
mainRouter.use("/admin", adminRoutes);
mainRouter.use('/customer', customerRoutes);
mainRouter.use('/agent', agentRoutes);
mainRouter.use('/service',serviceRoutes)
// mainRouter.use('/upload',uploadRoutes)
mainRouter.use('/booking', bookingRoutes)
mainRouter.use('/payment', paymentRoutes)



module.exports = mainRouter;
