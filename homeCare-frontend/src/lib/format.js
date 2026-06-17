export const read = (key, fallback = "") => localStorage.getItem(key) || fallback;

export const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export const titleCase = (value = "") =>
  value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const normalizeName = (value = "") => String(value || "").trim().replace(/\s+/g, " ");

export const sameName = (left = "", right = "") =>
  normalizeName(left).toLowerCase() === normalizeName(right).toLowerCase();
