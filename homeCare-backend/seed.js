// Speedu Direct MongoDB Seed Script
// Backend chalu karne ki zaroorat NAHI hai
// Run: node seed.js
// Ye script seedha MongoDB me data daalti hai

require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || "speedu";

if (!MONGO_URI) {
  console.error("ERROR: MONGO_URI .env me nahi mila!");
  console.error(".env file check karo speedu-backend folder me");
  process.exit(1);
}

// Service Schema (model ke same)
const serviceSchema = new mongoose.Schema(
  {
    categoryName: String,
    variants: [{ variantName: String, variantPrice: Number }],
  },
  { timestamps: true }
);
const Service = mongoose.model("service", serviceSchema);

const SERVICES = [
  {
    categoryName: "Electrician",

    variants: [
      { variantName: "Fan Installation", variantPrice: 299 },
      { variantName: "Wiring Rewiring", variantPrice: 799 },
      { variantName: "Switchboard Repair", variantPrice: 399 },
      { variantName: "MCB Fuse Replacement", variantPrice: 249 },
    ],
  },
  {
    categoryName: "Plumber",
    variants: [
      { variantName: "Pipe Leakage Fix", variantPrice: 349 },
      { variantName: "Tap Faucet Repair", variantPrice: 199 },
      { variantName: "Bathroom Fitting", variantPrice: 999 },
      { variantName: "Drainage Unclogging", variantPrice: 499 },
    ],
  },
  {
    categoryName: "Carpenter",
    variants: [
      { variantName: "Door Window Repair", variantPrice: 449 },
      { variantName: "Furniture Assembly", variantPrice: 599 },
      { variantName: "Cupboard Installation", variantPrice: 1299 },
      { variantName: "Lock Replacement", variantPrice: 299 },
    ],
  },
  {
    categoryName: "Painter",
    variants: [
      { variantName: "Room Painting 1BHK", variantPrice: 3999 },
      { variantName: "Room Painting 2BHK", variantPrice: 6999 },
      { variantName: "Exterior Painting", variantPrice: 9999 },
      { variantName: "Wall Putty", variantPrice: 1999 },
    ],
  },
  {
    categoryName: "AC Service",
    variants: [
      { variantName: "AC Servicing 1 ton", variantPrice: 499 },
      { variantName: "AC Servicing 1.5 ton", variantPrice: 599 },
      { variantName: "Gas Refilling", variantPrice: 1499 },
      { variantName: "AC Installation", variantPrice: 999 },
    ],
  },
  {
    categoryName: "Cleaning",
    variants: [
      { variantName: "Home Deep Clean 1BHK", variantPrice: 1499 },
      { variantName: "Home Deep Clean 2BHK", variantPrice: 2499 },
      { variantName: "Sofa Cleaning", variantPrice: 799 },
      { variantName: "Carpet Cleaning", variantPrice: 699 },
    ],
  },
  {
    categoryName: "Pest Control",
    variants: [
      { variantName: "Cockroach Treatment", variantPrice: 699 },
      { variantName: "Bed Bug Treatment", variantPrice: 999 },
      { variantName: "Termite Treatment", variantPrice: 1499 },
      { variantName: "Full Home Pest Control", variantPrice: 1999 },
    ],
  },
  {
    categoryName: "Refrigerator Repair",
    variants: [
      { variantName: "Cooling Problem Fix", variantPrice: 599 },
      { variantName: "Compressor Check", variantPrice: 799 },
      { variantName: "Gas Refilling", variantPrice: 1299 },
      { variantName: "Door Gasket Replacement", variantPrice: 349 },
    ],
  },
  {
    categoryName: "Washing Machine Repair",
    variants: [
      { variantName: "Not Spinning Fix", variantPrice: 499 },
      { variantName: "Water Leakage Fix", variantPrice: 399 },
      { variantName: "PCB Repair", variantPrice: 999 },
      { variantName: "Drum Cleaning", variantPrice: 299 },
    ],
  },
  {
    categoryName: "TV Repair",
    variants: [
      { variantName: "LED Screen Repair", variantPrice: 1499 },
      { variantName: "No Display Fix", variantPrice: 799 },
      { variantName: "Sound Issue Fix", variantPrice: 499 },
      { variantName: "Smart TV Software Issue", variantPrice: 399 },
    ],
  },
  {
    categoryName: "RO Water Purifier",
    variants: [
      { variantName: "Filter Replacement", variantPrice: 699 },
      { variantName: "RO Service", variantPrice: 499 },
      { variantName: "RO Installation", variantPrice: 899 },
      { variantName: "Membrane Replacement", variantPrice: 1199 },
    ],
  },
  {
    categoryName: "Geyser Repair",
    variants: [
      { variantName: "Geyser Repair", variantPrice: 399 },
      { variantName: "Thermostat Replacement", variantPrice: 549 },
      { variantName: "Geyser Installation", variantPrice: 699 },
      { variantName: "Heating Element Replacement", variantPrice: 799 },
    ],
  },
  {
    categoryName: "CCTV Installation",
    variants: [
      { variantName: "1 Camera Installation", variantPrice: 1499 },
      { variantName: "4 Camera Setup", variantPrice: 4999 },
      { variantName: "DVR Setup", variantPrice: 999 },
      { variantName: "Camera Repair", variantPrice: 599 },
    ],
  },
  {
    categoryName: "Chimney Service",
    variants: [
      { variantName: "Chimney Cleaning", variantPrice: 499 },
      { variantName: "Motor Repair", variantPrice: 799 },
      { variantName: "Filter Replacement", variantPrice: 399 },
      { variantName: "Chimney Installation", variantPrice: 1299 },
    ],
  },
  {
    categoryName: "Microwave Repair",
    variants: [
      { variantName: "Not Heating Fix", variantPrice: 449 },
      { variantName: "Door Latch Repair", variantPrice: 299 },
      { variantName: "Control Panel Fix", variantPrice: 699 },
    ],
  },
  {
    categoryName: "Inverter Battery",
    variants: [
      { variantName: "Battery Check Service", variantPrice: 399 },
      { variantName: "Inverter Repair", variantPrice: 699 },
      { variantName: "Battery Replacement", variantPrice: 4999 },
    ],
  },
  {
    categoryName: "Movers Packers",
    variants: [
      { variantName: "Within City 1BHK", variantPrice: 3999 },
      { variantName: "Within City 2BHK", variantPrice: 5999 },
      { variantName: "Loading Unloading Only", variantPrice: 1999 },
    ],
  },
  {
    categoryName: "Sofa Furniture Repair",
    variants: [
      { variantName: "Sofa Cushion Repair", variantPrice: 599 },
      { variantName: "Wooden Furniture Polish", variantPrice: 799 },
      { variantName: "Recliner Fix", variantPrice: 1299 },
    ],
  },
  {
    categoryName: "Laptop Computer Repair",
    variants: [
      { variantName: "OS Installation", variantPrice: 499 },
      { variantName: "Virus Removal", variantPrice: 399 },
      { variantName: "Screen Replacement", variantPrice: 2499 },
      { variantName: "Keyboard Repair", variantPrice: 799 },
    ],
  },
  {
    categoryName: "Gardening",
    variants: [
      { variantName: "Garden Maintenance", variantPrice: 799 },
      { variantName: "Plant Trimming", variantPrice: 499 },
      { variantName: "Soil Fertiliser Service", variantPrice: 699 },
    ],
  },
  {
    categoryName: "Gas Stove Repair",
    variants: [
      { variantName: "Burner Cleaning", variantPrice: 199 },
      { variantName: "Auto Ignition Fix", variantPrice: 349 },
      { variantName: "Regulator Replacement", variantPrice: 499 },
    ],
  },
  {
    categoryName: "Door Lock Security",
    variants: [
      { variantName: "Lock Repair", variantPrice: 299 },
      { variantName: "Smart Lock Installation", variantPrice: 1999 },
      { variantName: "Key Duplicate", variantPrice: 149 },
    ],
  },
];

async function run() {
  console.log("\nSpeedu MongoDB Seed");
  console.log("====================");
  console.log("Connecting to MongoDB...");

  await mongoose.connect(MONGO_URI, {
    dbName: DB_NAME,
    serverSelectionTimeoutMS: 10000,
  });
  console.log("Connected!\n");

  // Get existing service names to skip duplicates
  const existing = await Service.find({}, { categoryName: 1 });
  const existingNames = new Set(existing.map((s) => s.categoryName.trim().toLowerCase()));
  console.log("Already in DB:", existingNames.size, "services\n");

  let addedSvc = 0;
  let addedVar = 0;

  for (const svc of SERVICES) {
    const key = svc.categoryName.trim().toLowerCase();

    if (existingNames.has(key)) {
      console.log("Skip (exists):", svc.categoryName);
      continue;
    }

    try {
      const created = await Service.create({
        categoryName: svc.categoryName,
        variants: svc.variants,
      });
      addedSvc++;
      addedVar += svc.variants.length;
      console.log("Created:", svc.categoryName, "(" + svc.variants.length + " variants)");
    } catch (e) {
      console.error("Failed:", svc.categoryName, "-", e.message);
    }
  }

  console.log("\n================================");
  console.log("Done!", addedSvc, "services added,", addedVar, "variants added!");
  console.log("================================\n");

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
