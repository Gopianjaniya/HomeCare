const customerController = require("../../controllers/customer/customer.controller");
const upload = require("../../multer/multer");
const customerRoutes = require("express").Router();

customerRoutes.post('/profile/:userId',upload.single("profile"), customerController.customerProfile);
customerRoutes.put('/updateprofile/:customerId',upload.single("profile"), customerController.updateCustomerProfile);
customerRoutes.post('/addresses/:customerId', customerController.customerAddresses);
customerRoutes.put('/:customerId/addresses/:addressId', customerController.updateCustomerAddress);
customerRoutes.delete('/:customerId/addresses/:addressId', customerController.deleteCustomerAddress)


module.exports = customerRoutes;