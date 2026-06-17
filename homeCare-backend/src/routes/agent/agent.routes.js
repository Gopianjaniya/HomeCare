const agentController = require("../../controllers/agent/agent.controller");
const upload = require("../../multer/multer");
const agentRoutes = require("express").Router();

agentRoutes.post('/agentProfile/:id',upload.single("profile"), agentController.agentProfile);
agentRoutes.put('/agentUpdateprofile/:agentId',upload.single("profile"), agentController.updateAgentProfile);
agentRoutes.post('/agentAddresses/:agentId', agentController.agentAddresses);
agentRoutes.get('/:agentId/wallet', agentController.getAgentWallet);
agentRoutes.put('/:agentId/addresses/:addressId', agentController.updateAgentAddress);
agentRoutes.delete('/:agentId/addresses/:addressId', agentController.deleteAgentAdress);


module.exports = agentRoutes;
