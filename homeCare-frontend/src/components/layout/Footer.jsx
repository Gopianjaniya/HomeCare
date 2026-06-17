import { titleCase } from "../../lib/format.js";

export function Footer({ services, onServiceClick }) {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:px-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-lg font-extrabold">
            <span className="grid h-9 w-9 place-items-center rounded-lg   bg-orange-600   text-white font-black text-xl shadow-md select-none">
              H
            </span>
            HomeCare
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-slate-400">
            Reliable home service booking for customers and agents - one clean flow from browse to payment.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Services</h3>
          <ul className="space-y-1">
            {services.slice(0, 6).map((service) => (
              <li key={service._id}>
                <button
                  type="button"
                  onClick={() => onServiceClick(service._id)}
                  className="text-left text-sm text-slate-400 transition hover:text-white"
                >
                  {titleCase(service.categoryName)}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Contact</h3>
          <p className="text-sm text-slate-400">support@homecare.in</p>
          <p className="text-sm text-slate-400">+91 xxxxx-xxxxx</p>
        </div>
      </div>
      <div className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
       ❤️ Copyright {new Date().getFullYear()} HomeCare. All rights reserved.
      </div>
    </footer>
  );
}
