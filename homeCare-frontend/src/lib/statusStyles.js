const base = "inline-flex min-h-7 items-center rounded-lg px-2.5 text-xs font-bold uppercase tracking-wide";

export function statusPillClass(status = "") {
  const s = String(status || "").toUpperCase();
  if (["ACCEPTED", "COMPLETED", "SUCCESS", "ONGOING"].includes(s)) {
    return `${base} bg-orange-50 text-orange-800 ring-1 ring-orange-100`;
  }
  if (["CANCELLED", "REJECTED", "FAILED"].includes(s)) {
    return `${base} bg-rose-50 text-rose-800 ring-1 ring-rose-100`;
  }
  return `${base} bg-slate-100 text-slate-700 ring-1 ring-slate-200`;
}
