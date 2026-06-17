const serviceController = require("../../controllers/service/service.controller");
const { authenticate, authorizeRoles } = require("../../middleware/auth.middleware");
const serviceRoutes = require("express").Router();
const adminOnly = [authenticate({ fetchUserFromDB: false }), authorizeRoles("admin")];
const agentOnly = [authenticate({ fetchUserFromDB: true }), authorizeRoles("agent")];
const adminOrAgent = [authenticate({ fetchUserFromDB: false }), authorizeRoles("admin", "agent")];

serviceRoutes.post('/createService', adminOrAgent, serviceController.createService);
serviceRoutes.get('/getService',serviceController.getService);
serviceRoutes.get('/admin/all', adminOnly, serviceController.getAllServicesForAdmin);
serviceRoutes.get('/agent/:agentId', serviceController.getAgentServices);
serviceRoutes.get('/getServiceById/:id',serviceController.getServiceById);
serviceRoutes.put('/updateService/:serviceId', adminOnly, serviceController.updateService);
serviceRoutes.patch('/:serviceId/approval', adminOnly, serviceController.updateServiceApproval);
serviceRoutes.delete('/deleteServiceById/:id', adminOnly, serviceController.deleteServiceById);

// variants api routes-----------------

serviceRoutes.post('/:serviceId/variant', adminOnly, serviceController.createVariants);
serviceRoutes.put('/:serviceId/variant/:variantId', adminOnly, serviceController.updateVariants);
serviceRoutes.get('/:serviceId/variants',serviceController.getVariants);
serviceRoutes.get('/:serviceId/variant/:variantId',serviceController.getVariantsById);
serviceRoutes.delete('/:serviceId/variant/:variantId', adminOnly, serviceController.deleteVariants);




module.exports = serviceRoutes;
