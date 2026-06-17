import { Mail, Phone } from "lucide-react";

export function Contact() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:px-12">
      <div className="flex flex-col gap-8 rounded-3xl border border-orange-200/70 bg-gradient-to-br from-orange-50/80 via-white to-slate-100/60 p-8 shadow-soft lg:flex-row lg:items-center lg:justify-between lg:p-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Need help with a booking?
          </h2>
          <p className="mt-2 max-w-xl text-slate-600">
            Customers and agents can reach HomeCare support for booking,
            payment, or profile issues.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="tel:+919876543210"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border   bg-orange-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-500"
          >
            <Phone className="h-4 w-4" aria-hidden />
            Call support
          </a>
          <a
            href="mailto:support@homecare.in"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <Mail className="h-4 w-4" aria-hidden />
            Email us
          </a>
        </div>
      </div>
    </section>
  );
}
