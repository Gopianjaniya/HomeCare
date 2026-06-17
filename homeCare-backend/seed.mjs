// Speedu Service Seed Script
  // ES Module version — Node 22+ compatible
  // Run: node seed.mjs
  //
  // Apna admin email/password yahan bharo:

  const API_URL = "http://localhost:5000";
  const ADMIN_EMAIL = "dipanshumalviya9@gmail.com"; // <- tumhara email
  const ADMIN_PASSWORD = "123456";                  // <- tumhara password

  const SERVICES = [
    {
      categoryName: "Electrician",
      variants: [
        { variantName: "Fan Installation", variantPrice: 299 },
        { variantName: "Wiring & Rewiring", variantPrice: 799 },
        { variantName: "Switchboard Repair", variantPrice: 399 },
        { variantName: "MCB / Fuse Replacement", variantPrice: 249 },
      ],
    },
    {
      categoryName: "Plumber",
      variants: [
        { variantName: "Pipe Leakage Fix", variantPrice: 349 },
        { variantName: "Tap / Faucet Repair", variantPrice: 199 },
        { variantName: "Bathroom Fitting", variantPrice: 999 },
        { variantName: "Drainage Unclogging", variantPrice: 499 },
      ],
    },
    {
      categoryName: "Carpenter",
      variants: [
        { variantName: "Door / Window Repair", variantPrice: 449 },
        { variantName: "Furniture Assembly", variantPrice: 599 },
        { variantName: "Cupboard Installation", variantPrice: 1299 },
        { variantName: "Lock Replacement", variantPrice: 299 },
      ],
    },
    {
      categoryName: "Painter",
      variants: [
        { variantName: "Room Painting (1 BHK)", variantPrice: 3999 },
        { variantName: "Room Painting (2 BHK)", variantPrice: 6999 },
        { variantName: "Exterior Painting", variantPrice: 9999 },
        { variantName: "Wall Putty", variantPrice: 1999 },
      ],
    },
    {
      categoryName: "AC Service & Repair",
      variants: [
        { variantName: "AC Servicing (1 ton)", variantPrice: 499 },
        { variantName: "AC Servicing (1.5 ton)", variantPrice: 599 },
        { variantName: "Gas Refilling", variantPrice: 1499 },
        { variantName: "AC Installation", variantPrice: 999 },
      ],
    },
    {
      categoryName: "Cleaning",
      variants: [
        { variantName: "Home Deep Clean (1 BHK)", variantPrice: 1499 },
        { variantName: "Home Deep Clean (2 BHK)", variantPrice: 2499 },
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
        { variantName: "Drum Cleaning Service", variantPrice: 299 },
      ],
    },
    {
      categoryName: "TV Repair",
      variants: [
        { variantName: "LED TV Screen Repair", variantPrice: 1499 },
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
      categoryName: "Geyser / Water Heater",
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
      categoryName: "Chimney Repair",
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
      categoryName: "Inverter & Battery",
      variants: [
        { variantName: "Battery Check & Service", variantPrice: 399 },
        { variantName: "Inverter Repair", variantPrice: 699 },
        { variantName: "Battery Replacement", variantPrice: 4999 },
      ],
    },
    {
      categoryName: "Movers & Packers",
      variants: [
        { variantName: "Within City (1 BHK)", variantPrice: 3999 },
        { variantName: "Within City (2 BHK)", variantPrice: 5999 },
        { variantName: "Loading & Unloading Only", variantPrice: 1999 },
      ],
    },
    {
      categoryName: "Sofa & Furniture Repair",
      variants: [
        { variantName: "Sofa Cushion Repair", variantPrice: 599 },
        { variantName: "Wooden Furniture Polish", variantPrice: 799 },
        { variantName: "Recliner Mechanism Fix", variantPrice: 1299 },
      ],
    },
    {
      categoryName: "Laptop & Computer Repair",
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
        { variantName: "Soil & Fertiliser Service", variantPrice: 699 },
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
      categoryName: "Door Lock & Security",
      variants: [
        { variantName: "Lock Repair", variantPrice: 299 },
        { variantName: "Smart Lock Installation", variantPrice: 1999 },
        { variantName: "Key Duplicate", variantPrice: 149 },
      ],
    },
  ];

  async function api(path, method = "GET", body = null, token = null) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = "Bearer " + token;
    const res = await fetch(API_URL + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) throw new Error(data.message || "HTTP " + res.status);
    return data;
  }

  console.log("\nSpeedu Seed Script");
  console.log("===================");

  // 1. Login
  console.log("\nAdmin login...");
  let adminToken;
  try {
    const login = await api("/admin/login", "POST", { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    adminToken = login.data?.accessToken;
    console.log("Login OK!");
  } catch (err) {
    console.error("Login failed:", err.message);
    process.exit(1);
  }

  // 2. Existing services
  const existing = await api("/service/getService", "GET", null, adminToken);
  const existingList = existing.data || [];
  const existingNames = new Set(existingList.map((s) => s.categoryName.trim().toLowerCase()));
  console.log("Already in DB:", existingNames.size, "services\n");

  let addedServices = 0;
  let addedVariants = 0;

  // 3. Create services + variants
  for (const svc of SERVICES) {
    const key = svc.categoryName.trim().toLowerCase();
    let serviceId;

    if (existingNames.has(key)) {
      const match = existingList.find((s) => s.categoryName.trim().toLowerCase() === key);
      serviceId = match?._id;
      console.log("Skip (exists):", svc.categoryName);
    } else {
      try {
        const created = await api("/service/createService", "POST", { categoryName: svc.categoryName }, adminToken);
        serviceId = created.data?._id;
        existingNames.add(key);
        addedServices++;
        console.log("Created:", svc.categoryName);
      } catch (err) {
        console.error("Failed:", svc.categoryName, "-", err.message);
        continue;
      }
    }

    if (!serviceId) continue;

    for (const v of svc.variants) {
      try {
        await api("/service/" + serviceId + "/variant", "POST", { variantName: v.variantName, variantPrice: v.variantPrice }, adminToken);
        addedVariants++;
        console.log("  + " + v.variantName + " Rs." + v.variantPrice);
      } catch (err) {
        if (/already|exists|duplicate/i.test(err.message)) {
          console.log("  (skip):", v.variantName);
        } else {
          console.error("  Variant error:", v.variantName, "-", err.message);
        }
      }
    }
  }

  console.log("\n=================================");
  console.log("Done!", addedServices, "services,", addedVariants, "variants added!");
  console.log("=================================\n");
  