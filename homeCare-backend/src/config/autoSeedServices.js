const fs = require("fs");
const path = require("path");
const vm = require("vm");
const serviceModel = require("../models/service.model");
const logger = require("../utils/logger");

function cleanText(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function key(value) {
  return cleanText(value).toLowerCase();
}

function loadSeedServices() {
  const seedPath = path.join(__dirname, "../../seed.js");
  const seedSource = fs.readFileSync(seedPath, "utf8");
  const match = seedSource.match(/const SERVICES = (\[[\s\S]*?\n\]);/);

  if (!match) {
    throw new Error("SERVICES array not found in seed.js");
  }

  const context = { SERVICES: [] };
  vm.runInNewContext(`SERVICES = ${match[1]}`, context);
  return context.SERVICES;
}

async function autoSeedServices() {
  if (process.env.SEED_SERVICES_ON_START === "false") {
    return;
  }

  const services = loadSeedServices();
  const existingServices = await serviceModel.find({}, { categoryName: 1, variants: 1 });
  const existingByName = new Map(existingServices.map((service) => [key(service.categoryName), service]));

  let addedServices = 0;
  let addedVariants = 0;

  for (const service of services) {
    const categoryName = cleanText(service.categoryName);
    const variants = (service.variants || [])
      .map((variant) => ({
        variantName: cleanText(variant.variantName),
        variantPrice: Number(variant.variantPrice),
      }))
      .filter((variant) => variant.variantName && Number.isFinite(variant.variantPrice) && variant.variantPrice > 0);

    if (!categoryName || variants.length === 0) {
      continue;
    }

    const serviceKey = key(categoryName);
    const existing = existingByName.get(serviceKey);

    if (!existing) {
      const created = await serviceModel.create({
        categoryName,
        approvalStatus: "APPROVED",
        variants,
      });

      existingByName.set(serviceKey, created);
      addedServices++;
      addedVariants += variants.length;
      continue;
    }

    const existingVariantNames = new Set((existing.variants || []).map((variant) => key(variant.variantName)));
    const missingVariants = variants.filter((variant) => !existingVariantNames.has(key(variant.variantName)));

    if (missingVariants.length > 0) {
      existing.variants.push(...missingVariants);
      await existing.save();
      addedVariants += missingVariants.length;
    }
  }

  logger.info("[SEED] Services checked", { addedServices, addedVariants });
}

module.exports = autoSeedServices;
