const rawApiBase =
  import.meta.env.VITE_API_BASE_URL || "https://homecare-1-ftut.onrender.com/api";

export const API_BASE = rawApiBase.replace(/\/+$/, "");
export const API_ORIGIN = API_BASE.replace(/\/api$/, "");
