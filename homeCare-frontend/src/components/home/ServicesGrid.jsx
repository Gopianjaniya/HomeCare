import { titleCase } from "../../lib/format.js";
import {
  Zap,
  Wrench,
  Hammer,
  Paintbrush,
  Snowflake,
  Sparkles,
  Bug,
  Tv,
  Droplets,
  Flame,
  Camera,
  ChefHat,
  Microwave,
  Battery,
  Truck,
  Sofa,
  Laptop,
  Trees,
  CookingPot,
  Lock,
  Archive,
  WashingMachine,
  WashingMachineIcon
} from "lucide-react";

const iconMap = {
  Electrician: Zap,
  Plumber: Wrench,
  Carpenter: Hammer,
  Painter: Paintbrush,
  "AC Service": Snowflake,
  Cleaning: Sparkles,
  "Pest Control": Bug,
  "TV Repair": Tv,
  "RO Water Purifier": Droplets,
  "Geyser Repair": Flame,

  // New Categories
  "CCTV Installation": Camera,
  "Chimney Service": ChefHat,
  "Microwave Repair": Microwave,
  "Inverter Battery": Battery,
  "Movers Packers": Truck,
  "Sofa Furniture Repair": Sofa,
  "Laptop Computer Repair": Laptop,
  Gardening: Trees,
  "Gas Stove Repair": CookingPot,
  "Door Lock Security": Lock,
  "Refrigerator Repair":Archive,
  "Washing Machine Repair":WashingMachineIcon
};
export function ServicesGrid({ services, openService }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:px-12" id="services">
      <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Popular services
          </h2>
          <p className="mt-1 text-slate-600">
            Choose a category, pick a variant, and lock your visit time.
          </p>
        </div>
      </div>
      {services.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ">
          {services.map((service) => {
            const Icon = iconMap[service.categoryName] || Wrench;
            return (
              <button
                key={service._id}
                type="button"
                onClick={() => openService(service._id)}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-300/80 hover:shadow-lift"
              >
                <div>
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-orange-50 text-orange-700 ring-1 ring-orange-100 transition group-hover:bg-orange-100 ">
                    {" "}
                    {Icon && <Icon size={28} />}
                  </span>
                  <h3 className="mt-4 text-lg font-bold capitalize text-slate-900">
                    {titleCase(service.categoryName || "Service")}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {service.variants?.length || 0} variants available
                  </p>
                </div>
                <span className="mt-6 text-sm font-bold text-orange-700">
                  View options →
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 py-16 text-center text-slate-500">
          No services found. Add services from the admin panel.
        </div>
      )}
    </section>
  );
}
