const adminRoutes = require("express").Router();
const adminController = require("../../controllers/admin/admin.controller");

adminRoutes.post("/login", adminController.adminLogin);

module.exports = adminRoutes;
