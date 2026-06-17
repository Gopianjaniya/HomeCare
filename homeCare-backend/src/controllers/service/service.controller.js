// const { success } = require("../../utils/logger");
const agentModel = require("../../models/agent.model");
const serviceModel = require("../../models/service.model");
const logger = require ("../../utils/logger");
 

exports.createService = async (req , res) => {
    try {
        logger.info("Create service api called ....");
        const { agentId, categoryName, variantName, variantPrice } = req.body;
        const cateName = String(categoryName || "").trim().replace(/\s+/g, " ").toLowerCase();
        const cleanVariantName = String(variantName || "").trim().replace(/\s+/g, " ");
        const cleanVariantPrice = Number(variantPrice);

        if (!cateName) {
            return res.status(400).json({ success: false, message: "service name is required" });
        }

        if (req.user?.role !== "admin" && !cleanVariantName) {
            return res.status(400).json({ success: false, message: "variant name is required" });
        }

        if (req.user?.role !== "admin" && (!Number.isFinite(cleanVariantPrice) || cleanVariantPrice <= 0)) {
            return res.status(400).json({ success: false, message: "variant price must be greater than 0" });
        }

        let ownerAgentId = agentId || null;
        if (req.user?.role === "agent") {
            const agent = await agentModel.findOne({ userId: req.user.userId || req.user.id });
            if (!agent) {
                return res.status(404).json({ success: false, message: "agent profile not found" });
            }
            ownerAgentId = agent._id;
        }

        if (req.user?.role !== "admin" && !ownerAgentId) {
            return res.status(400).json({ success: false, message: "agent id is required" });
        }

        if (req.user?.role === "agent") {
            const ownerAgent = await agentModel.findById(ownerAgentId);
            if (!ownerAgent) {
                return res.status(404).json({ success: false, message: "agent profile not found" });
            }
            const agentSkills = new Set((ownerAgent.skills || []).map((skill) => String(skill || "").trim().replace(/\s+/g, " ").toLowerCase()));
            if (!agentSkills.has(cateName)) {
                ownerAgent.skills = [...agentSkills, cateName];
                await ownerAgent.save();
            }
        }

        const isExist = await serviceModel.findOne ({ categoryName: cateName, agentId: ownerAgentId });

        if( isExist) {
            return res.status(409).json({ success: false, message: "service already exists for this agent", statusCode: 409});

        }
        const cat = await serviceModel.create({
            agentId: ownerAgentId,
            categoryName: cateName,
            approvalStatus: req.user?.role === "admin" ? "APPROVED" : "PENDING",
            variants: cleanVariantName ? [{ variantName: cleanVariantName, variantPrice: cleanVariantPrice }] : [],
        });

        return res.status(201).json({
            success: true,
            message: "category created successfully",
            data: cat

        });
    } catch (error){
        logger.error('Error' , error);
        return res.status(500).json({ success: false, message: "failed to create service"})
    }

};
exports.updateService = async (req, res) => {
  try {
    logger.info("updateService api called");
    const {serviceId} = req.params
    const {categoryName} = req.body
    const service = await serviceModel.findById(serviceId)
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "service not found"
      })
    }
     service.categoryName = categoryName;
     await service.save();
      return res.status(200).json({
           success: true,
           message: "user profile updated successfully",
           data: service,
         });
       } catch (error) {
         logger.error("Error", error);
         return res.status(500).json({ success: false, message: "internal server error" });
       }
  }


exports.getService = async ( req, res) => {
    logger.info("get service api called.....");
    try { 
        const cat = await serviceModel.find({
            $or: [
                { approvalStatus: "APPROVED" },
                { approvalStatus: { $exists: false } },
            ],
        });
        return res.status(200).json({
            success: true,
            message: "category get succefully ",
            data: cat
        })
    } catch (error){ 
        logger.error('Error', error);
        return res.status(500).json({
            success: false,
            message: "category not found"
        });
    }
};

exports.getAllServicesForAdmin = async ( req, res) => {
    logger.info("get all services for admin api called.....");
    try {
        const services = await serviceModel.find({}).populate("agentId").sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            message: "services fetched successfully",
            data: services
        });
    } catch (error){
        logger.error('Error', error);
        return res.status(500).json({
            success: false,
            message: "services not found"
        });
    }
};

exports.getAgentServices = async ( req, res) => {
    logger.info("get agent services api called.....");
    try {
        const { agentId } = req.params;
        const services = await serviceModel.find({ agentId }).populate("agentId").sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            message: "agent services fetched successfully",
            data: services
        });
    } catch (error){
        logger.error('Error', error);
        return res.status(500).json({
            success: false,
            message: "agent services not found"
        });
    }
};

exports.updateServiceApproval = async (req, res) => {
  try {
    logger.info("updateServiceApproval api called");
    const { serviceId } = req.params;
    const { approvalStatus } = req.body;
    const nextStatus = String(approvalStatus || "").toUpperCase();

    if (!["PENDING", "APPROVED", "REJECTED"].includes(nextStatus)) {
      return res.status(400).json({
        success: false,
        message: "invalid approval status",
      });
    }

    const service = await serviceModel.findByIdAndUpdate(
      serviceId,
      { approvalStatus: nextStatus },
      { new: true }
    ).populate("agentId");

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "service not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "service approval updated successfully",
      data: service,
    });
  } catch (error) {
    logger.error("Error", error);
    return res.status(500).json({ success: false, message: "internal server error" });
  }
};

exports.getServiceById = async (req,res) => {
    try {
        logger.info("getservicebyid api called");
        const service = await serviceModel.findOne({_id: req.params.id});
        return res.status(200).json({
            success: true,
            message: "service found successfully",
            data: service
        });
    } catch(error) { 
        logger.error('Error', error);
        return res.status(500).json({
            success: false,
            message: "service not founded"
        });
    }
};
exports.deleteServiceById = async (req, res) => {
    try { 
        logger.info("deleteservice api called");
        const isExist = await serviceModel.findOne({_id:req.params.id});
        if(!isExist) {
            return res.status(500).json({
                success: false,
                message: "service not founded",
                statusCode: 409
            })
        }
        const cat = await serviceModel.deleteOne({_id:req.params.id});
        return res.status(200).json({
            success: true,
            message: "category deleted successfully",
            data: cat
        });

    } catch(error) {
        logger.error('Error', error)
        return res.status(500).json({
            success: false,
            message: "failed to delete service by id "
        });
    };
        
};


//-----variant api in srrvices


exports.createVariants = async (req, res) => {
    try {
        logger.info("creat variant api called");
        const {serviceId} = req.params;
        const {variantName, variantPrice} = req.body;
        const cleanVariantName = String(variantName || "").trim().replace(/\s+/g, " ");
        const cleanVariantPrice = Number(variantPrice);

        if (!cleanVariantName) {
            return res.status(400).json({
                success: false,
                message: "variant name is required",
            });
        }

        if (!Number.isFinite(cleanVariantPrice) || cleanVariantPrice <= 0) {
            return res.status(400).json({
                success: false,
                message: "variant price must be greater than 0",
            });
        }

        const service = await serviceModel.findOne({_id:serviceId});

        if(!service) {
            return res.status(404).json({
                success: false, 
                message: "service not found",
            });
        }
        const variantExists = service.variants.some(
            (variant) => String(variant.variantName || "").trim().replace(/\s+/g, " ").toLowerCase() === cleanVariantName.toLowerCase()
        );

        if (variantExists) {
            return res.status(409).json({
                success: false,
                message: "variant already exists in this service",
            });
        }

        service.variants.push({variantName: cleanVariantName, variantPrice: cleanVariantPrice});
        await service.save();
        return res.status(201).json({
            success: true,
            message: "service variant created successfully",
            data: service
        });
    } catch (error) {
        logger.error("Error", error);
        return res.status(500).json({
            success: false,
            message: "variant not created "
        });

    };
};

exports.updateVariants = async (req, res) => {
  try {
    logger.info("updateVariant api called");

    const { serviceId, variantId } = req.params;
    const { variantName, variantPrice } = req.body;

    const service = await serviceModel.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "service not found",
      });
    }

    const variant = service.variants.id(variantId);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "variant not found for update",
      });
    }

    if (variantName) variant.variantName = variantName;
    if (variantPrice !== undefined) variant.variantPrice = variantPrice;
    await service.save();

    return res.status(200).json({
      success: true,
      message: "variant updated successfully",
      data: service.variants,
    });

  } catch (error) {
    logger.error("Error", error);
    return res.status(500).json({
      success: false,
      message: "failed to update variant",
    });
  }
};



exports.getVariantsById = async (req, res) => {
  try {
    const { serviceId, variantId } = req.params;

    const service = await serviceModel.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    const variant = service.variants.id(variantId);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Variant get successfully",
      data: variant
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


exports.getVariants = async (req, res) => {
    try {
        logger.info("getVariants api called");
        const {serviceId} = req.params;
        const service = await serviceModel.findById(serviceId).select("variants");

        if(!service) {
            return res.status(404).json({
                success: false,
                message: "service not found",
            })
        }
        return res.status(200).json({
            success: true,
            message: "variants get successfully",
            data: service.variants
        });
    } catch(error) {
        logger.error('Error', error);
        return res.status(500).json({
            success: false,
            message: "can't found variants"
        });
    };
};

exports.deleteVariants = async (req, res) => {
  try {
    logger.info("deleteVariants api called");

    const { serviceId, variantId } = req.params;

    const service = await serviceModel.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "service not found",
      });
    }
    const variant = service.variants.id(variantId);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "variant not found",
      });
    }
    variant.deleteOne(); 
    await service.save();

    return res.status(200).json({
      success: true,
      message: "variant deleted successfully",
      data: service.variants,
    });

  } catch (error) {
    logger.error("Error", error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};




