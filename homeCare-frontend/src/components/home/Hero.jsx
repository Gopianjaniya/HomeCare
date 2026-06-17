import { Search, ShieldCheck } from "lucide-react";
import { Button } from "../ui/Button.jsx";

export function Hero({ search, setSearch, loadServices }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-orange-50/70 via-white to-white">
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-12 lg:py-20">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-800 shadow-sm backdrop-blur">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            Trusted home services
          </div>
          <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl lg:leading-[1.05]">
            Home care, booked in minutes - not hours.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
            HomeCare connects you with verified pros for repairs, cleaning, and everyday fixes. Pick a service, choose a
            slot, pay securely.
          </p>
          <div className="mt-8 flex max-w-xl flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white/90 p-2 shadow-soft backdrop-blur sm:flex-row sm:items-center sm:gap-2 sm:p-2">
            <div className="flex flex-1 items-center gap-2 px-3 py-2">
              <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search electrician, cleaning, plumber..."
                className="min-h-11 w-full border-0 bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
            <Button variant="primary" className="shrink-0 sm:px-6" type="button" onClick={loadServices}>
              Refresh list
            </Button>
          </div>
        </div>
        <div
          className="relative min-h-[280px] overflow-hidden rounded-3xl border border-slate-200/80 shadow-lift lg:min-h-[420px]"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(15, 23, 42, 0.15), rgba(15, 23, 42, 0.55)), url(https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-6 text-white">
            <p className="text-sm font-medium text-orange-200">Same-day slots</p>
            <p className="text-lg font-bold">Quality work, transparent pricing</p>
          </div>
        </div>
      </div>
    </section>
  );
}
