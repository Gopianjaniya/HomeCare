import { CalendarDays, ShieldCheck, UsersRound, WalletCards } from "lucide-react";

export function WhyChooseUs() {
  const items = [
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Verified professionals",
      text: "Agent profiles, addresses, and availability make service assignment simple.",
    },
    {
      icon: <CalendarDays className="h-6 w-6" />,
      title: "Fast booking",
      text: "Customers can choose a service, variant, time slot, and address in one flow.",
    },
    {
      icon: <WalletCards className="h-6 w-6" />,
      title: "Easy payment",
      text: "COD and online payment options keep payment status easy to track.",
    },
    {
      icon: <UsersRound className="h-6 w-6" />,
      title: "Customer + agent app",
      text: "Customer bookings and the agent dashboard are available in one frontend.",
    },
  ];

  return (
    <section className="border-y border-slate-200/80 bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 lg:px-12">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Why choose HomeCare</h2>
          <p className="mt-2 text-slate-600">Simple, practical, and wired to your existing backend APIs.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-orange-50/40 p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-orange-50 text-orange-700">
                {item.icon}
              </span>
              <h3 className="mt-4 text-base font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
