import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  CreditCard,
  Gauge,
  IndianRupee,
  LogOut,
  Menu,
  Plus,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  UserCog,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { money, titleCase } from "../../lib/format.js";
import { statusPillClass } from "../../lib/statusStyles.js";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { Field } from "../ui/Field.jsx";

const navItems = [
  { id: "bookings", label: "All Bookings", icon: ClipboardList },
  { id: "services", label: "Services Management", icon: Wrench },

  { id: "customers", label: "Customers", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

function countBookings(bookings) {
  return bookings.reduce(
    (counts, booking) => {
      const status = String(booking.status || "").toUpperCase();
      if (status === "PENDING") counts.pending += 1;
      else if (["ACCEPTED", "ONGOING", "ASSIGNED"].includes(status))
        counts.assigned += 1;
      else if (status === "COMPLETED") counts.completed += 1;
      else if (status === "CANCELLED" || status === "REJECTED")
        counts.cancelled += 1;
      return counts;
    },
    { pending: 0, assigned: 0, completed: 0, cancelled: 0 },
  );
}

function summarizeAgents(services) {
  const agents = new Map();

  services.forEach((service) => {
    const agent = service.agentId;
    const id = agent?._id || agent;
    if (!id) return;

    const key = id;
    const variants = service.variants || [];
    const prices = variants
      .map((variant) => Number(variant.variantPrice || 0))
      .filter((price) => price > 0);
    const current = agents.get(key) || {
      id: key,
      name:
        agent?.fullName || agent?.name || agent?.mobile || "Service Provider",
      mobile: agent?.mobile || "",
      services: [],
      variants: 0,
      minRate: null,
      maxRate: null,
      status: service.approvalStatus || "ACTIVE",
    };

    current.services.push(titleCase(service.categoryName || "Service"));
    current.variants += variants.length;
    prices.forEach((price) => {
      current.minRate =
        current.minRate === null ? price : Math.min(current.minRate, price);
      current.maxRate =
        current.maxRate === null ? price : Math.max(current.maxRate, price);
    });
    agents.set(key, current);
  });

  return Array.from(agents.values());
}

function summarizeCustomers(bookings) {
  const customers = new Map();

  bookings.forEach((booking) => {
    const customer = booking.customerId;
    const key = customer?._id || customer || booking.mobile || booking._id;
    const current = customers.get(key) || {
      id: key,
      name: customer?.fullName || customer?.name || "Customer",
      mobile: customer?.mobile || "",
      bookings: 0,
      completed: 0,
      totalSpend: 0,
      lastService: "",
    };

    current.bookings += 1;
    current.totalSpend += Number(booking.price || 0);
    current.lastService = titleCase(
      booking.serviceName || booking.serviceId?.categoryName || "Service",
    );
    if (String(booking.status || "").toUpperCase() === "COMPLETED")
      current.completed += 1;
    customers.set(key, current);
  });

  return Array.from(customers.values());
}

function AdminNavButton({ item, activeSection, onClick }) {
  const Icon = item.icon;
  const active = activeSection === item.id;

  return (
    <button
      type="button"
      onClick={() => onClick(item.id)}
      className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition ${
        active
          ? "bg-orange-600 text-white shadow-sm"
          : "text-slate-600 hover:bg-orange-50 hover:text-orange-700"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      <span className="whitespace-nowrap">{item.label}</span>
    </button>
  );
}

function BookingCountPill({ label, value, tone }) {
  const tones = {
    pending: "border-amber-200 bg-amber-50 text-amber-800",
    assigned: "border-orange-200 bg-orange-50 text-orange-800",
    completed: "border-zinc-200 bg-zinc-50 text-zinc-800",
    cancelled: "border-rose-200 bg-rose-50 text-rose-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${tones[tone]}`}
    >
      {label}
      <strong>{value}</strong>
    </span>
  );
}

function StatCard({ icon, label, value, hint }) {
  return (
    <div className="rounded-xl border border-zinc-200/90 bg-white p-4 shadow-sm transition hover:border-orange-200 hover:shadow-md sm:p-5">
      <span className="grid h-11 w-11 place-items-center rounded-lg bg-orange-50 text-orange-700">
        {icon}
      </span>
      <p className="mt-4 text-xs font-bold uppercase text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-900">
        {value}
      </strong>
      {hint && (
        <span className="mt-1 block text-xs font-medium text-slate-500">
          {hint}
        </span>
      )}
    </div>
  );
}

function EmptyPanel({ icon, title, description }) {
  return (
    <div className="rounded-xl border border-dashed border-orange-200 bg-orange-50/70 p-5 text-sm text-slate-600">
      <span className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-white text-orange-700 shadow-sm">
        {icon}
      </span>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="mt-1 leading-relaxed">{description}</p>
    </div>
  );
}

function AgentCard({ agent }) {
  const rate =
    agent.minRate === null
      ? "Rate not added"
      : agent.minRate === agent.maxRate
        ? money(agent.minRate)
        : `${money(agent.minRate)} - ${money(agent.maxRate)}`;

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <strong className="block truncate text-sm text-slate-900">
            {agent.name}
          </strong>
          <p className="mt-1 truncate text-xs text-slate-500">
            {agent.mobile || `${agent.services.length} service categories`}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-orange-200 bg-orange-50 px-2 py-1 text-[11px] font-bold text-orange-700">
          {agent.status}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {agent.services.slice(0, 3).map((service) => (
          <span
            key={service}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600"
          >
            {service}
          </span>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <span className="rounded-lg bg-white p-2 text-slate-500">
          Variants
          <strong className="block text-sm text-slate-900">
            {agent.variants}
          </strong>
        </span>
        <span className="rounded-lg bg-white p-2 text-slate-500">
          Service rate
          <strong className="block text-sm text-slate-900">{rate}</strong>
        </span>
      </div>
    </div>
  );
}

function CustomerCard({ customer }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <strong className="block truncate text-sm text-slate-900">
            {customer.name}
          </strong>
          <p className="mt-1 truncate text-xs text-slate-500">
            {customer.mobile || customer.lastService}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700">
          {customer.bookings} bookings
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <span className="rounded-lg bg-white p-2 text-slate-500">
          Completed
          <strong className="block text-sm text-slate-900">
            {customer.completed}
          </strong>
        </span>
        <span className="rounded-lg bg-white p-2 text-slate-500">
          Spend
          <strong className="block text-sm text-slate-900">
            {money(customer.totalSpend)}
          </strong>
        </span>
        <span className="rounded-lg bg-white p-2 text-slate-500">
          Last
          <strong className="block truncate text-sm text-slate-900">
            {customer.lastService}
          </strong>
        </span>
      </div>
    </div>
  );
}

export function Admin({
  services,
  bookings,
  payments,
  loading,
  createService,
  createVariant,
  removeService,
  removeVariant,
  loadAdminData,
  logoutAdmin,
  adminEmail,
}) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const bookingCounts = useMemo(() => countBookings(bookings), [bookings]);
  const revenue = payments.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );
  const notificationCount =
    bookingCounts.pending +
    services.filter((service) => service.approvalStatus === "PENDING").length;
  // const agents = useMemo(() => summarizeAgents(services), [services]);
  const customers = useMemo(() => summarizeCustomers(bookings), [bookings]);
  // const uniqueAgents = agents.length;
  const uniqueCustomers = customers.length;

  const jumpTo = (sectionId) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    document
      .getElementById(`admin-${sectionId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto max-w-7xl px-3 py-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => jumpTo("dashboard")}
              className="inline-flex min-w-0 items-center gap-3 text-left"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-orange-600 text-lg font-black text-white shadow-sm">
                H
              </span>
              <span className="min-w-0">
                <strong className="block truncate text-base font-black text-slate-950 sm:text-lg">
                  HomeCare Admin
                </strong>
              </span>
            </button>

            <nav className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => (
                <AdminNavButton
                  key={item.id}
                  item={item}
                  activeSection={activeSection}
                  onClick={jumpTo}
                />
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                title="Notifications"
                className="relative grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
              >
                <Bell className="h-5 w-5" aria-hidden />
                {notificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white">
                    {notificationCount}
                  </span>
                )}
              </button>

              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setProfileOpen((current) => !current)}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-orange-500 text-white">
                    <ShieldCheck className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="hidden max-w-36 truncate xl:block">
                    {adminEmail || "Admin"}
                  </span>
                  <ChevronDown className="h-4 w-4" aria-hidden />
                </button>
                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProfileOpen(false)}
                    />
                    <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl">
                      {["My Profile", "Change Password", "Settings"].map(
                        (label) => (
                          <button
                            key={label}
                            type="button"
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-700"
                          >
                            <Settings className="h-4 w-4" aria-hidden />
                            {label}
                          </button>
                        ),
                      )}
                      <button
                        type="button"
                        onClick={logoutAdmin}
                        className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" aria-hidden />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
                onClick={() => setMobileMenuOpen((current) => !current)}
                aria-label="Toggle admin menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="mt-3 grid gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-lg lg:hidden">
              <div className="grid gap-2 sm:grid-cols-2">
                {navItems.map((item) => (
                  <AdminNavButton
                    key={item.id}
                    item={item}
                    activeSection={activeSection}
                    onClick={jumpTo}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={logoutAdmin}
                className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-rose-50 px-3 text-sm font-bold text-rose-600"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-3 py-6 sm:px-4 lg:px-6 lg:py-8">
        <section id="admin-dashboard" className="scroll-mt-32">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-orange-600">
                Admin Dashboard
              </p>
              <h1 className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">
                Home services control center
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                AC Repair, Electrician, Plumber, Carpenter, Cleaning, Painting,
                and Appliance Repair operations in one place.
              </p>
            </div>
            <Button
              variant="secondary"
              type="button"
              onClick={() => loadAdminData()}
              className="border-orange-200 text-orange-800 hover:bg-orange-50"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              Refresh data
            </Button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<Wrench className="h-5 w-5" />}
              label="Services"
              value={services.length}
              hint="Live and pending categories"
            />
            <StatCard
              icon={<ClipboardList className="h-5 w-5" />}
              label="Bookings"
              value={bookings.length}
              hint={`${bookingCounts.pending} pending today`}
            />
            <StatCard
              icon={<CreditCard className="h-5 w-5" />}
              label="Payments"
              value={payments.length}
              hint="Successful and pending payments"
            />
            <StatCard
              icon={<IndianRupee className="h-5 w-5" />}
              label="Revenue"
              value={money(revenue)}
              hint="Total collected amount"
            />
          </div>
        </section>

        <section id="admin-services" className="scroll-mt-32">
          <div className="mt-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <Card className="rounded-xl border-orange-100">
              <h2 className="text-lg font-bold text-slate-900">
                Services Management
              </h2>
              <form className="mt-4 grid gap-4" onSubmit={createService}>
                <Field label="Add Service">
                  <input
                    name="categoryName"
                    placeholder="e.g. AC Repair"
                    maxLength="60"
                    required
                  />
                </Field>
                <Button
                  variant="primary"
                  disabled={loading}
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4" aria-hidden />
                  Add service
                </Button>
              </form>
            </Card>

            <Card className="rounded-xl border-orange-100">
              <h2 className="text-lg font-bold text-slate-900">
                Edit Service Variants
              </h2>
              <form className="mt-4 grid gap-4" onSubmit={createVariant}>
                <Field label="Service">
                  <select name="serviceId" required>
                    <option value="">Select service</option>
                    {services.map((service) => (
                      <option key={service._id} value={service._id}>
                        {titleCase(service.categoryName)}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Variant name">
                    <input
                      name="variantName"
                      placeholder="Fan repair"
                      maxLength="80"
                      required
                    />
                  </Field>
                  <Field label="Price (Rs)">
                    <input
                      type="number"
                      name="variantPrice"
                      min="1"
                      step="1"
                      placeholder="199"
                      required
                    />
                  </Field>
                </div>
                <Button
                  variant="primary"
                  disabled={loading}
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4" aria-hidden />
                  Add variant
                </Button>
              </form>
            </Card>
          </div>
        </section>

        <section
          id="admin-bookings"
          className="mt-8 scroll-mt-32 grid gap-5 xl:grid-cols-[1fr_0.85fr]"
        >
          <Card className="rounded-xl border-orange-100">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-bold text-slate-900">All Bookings</h2>
              <div className="flex flex-wrap gap-2">
                <BookingCountPill
                  label="Pending"
                  value={bookingCounts.pending}
                  tone="pending"
                />
                <BookingCountPill
                  label="Assigned"
                  value={bookingCounts.assigned}
                  tone="assigned"
                />
                <BookingCountPill
                  label="Completed"
                  value={bookingCounts.completed}
                  tone="completed"
                />
                <BookingCountPill
                  label="Cancelled"
                  value={bookingCounts.cancelled}
                  tone="cancelled"
                />
              </div>
            </div>
            <div className="mt-4 grid max-h-[520px] gap-2 overflow-y-auto pr-1">
              {bookings.length ? (
                bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div className="min-w-0">
                      <strong className="block truncate text-sm text-slate-900">
                        {booking.serviceName ||
                          booking.serviceId?.categoryName ||
                          "Service"}{" "}
                        - {booking.variantName || "Variant"}
                      </strong>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {booking.customerId?.fullName || "Customer"} -{" "}
                        {money(booking.price)}
                      </p>
                    </div>
                    <span
                      className={`w-fit ${statusPillClass(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-500">
                  No bookings.
                </div>
              )}
            </div>
          </Card>

          <Card className="rounded-xl border-orange-100">
            <h2 className="text-lg font-bold text-slate-900">
              Services & Variants
            </h2>
            <div className="mt-4 grid max-h-[520px] gap-3 overflow-y-auto pr-1">
              {services.length ? (
                services.map((service) => (
                  <div
                    key={service._id}
                    className="rounded-xl border border-slate-100 bg-slate-50/80 p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <strong className="min-w-0 truncate text-slate-900">
                        {titleCase(service.categoryName)}
                      </strong>
                      <button
                        type="button"
                        title="Delete service"
                        aria-label={`Delete ${service.categoryName}`}
                        disabled={loading}
                        className="inline-grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => removeService(service)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {service.variants?.length ? (
                        service.variants.map((variant) => (
                          <span
                            key={variant._id}
                            className="inline-flex max-w-full items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600"
                          >
                            <span className="truncate">
                              {variant.variantName} -{" "}
                              {money(variant.variantPrice)}
                            </span>
                            <button
                              type="button"
                              title="Delete variant"
                              aria-label={`Delete ${variant.variantName}`}
                              disabled={loading}
                              className="inline-grid h-7 w-7 shrink-0 place-items-center rounded-md border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                              onClick={() => removeVariant(service, variant)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">
                          No variants
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-500">
                  No services.
                </div>
              )}
            </div>
          </Card>
        </section>

        <section className="mt-8 grid gap-5 xl:grid-cols-2 ">
          <Card
            id="admin-customers"
            className="scroll-mt-32 rounded-xl border-orange-100"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-orange-600">
                  Customers Management
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  {uniqueCustomers} customers
                </h2>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-orange-50 text-orange-700">
                <Users className="h-5 w-5" />
              </span>
            </div>
            <div className="mt-4 grid max-h-[520px] gap-3 overflow-y-auto pr-1">
              {customers.length ? (
                customers.map((customer) => (
                  <CustomerCard key={customer.id} customer={customer} />
                ))
              ) : (
                <EmptyPanel
                  icon={<Users className="h-5 w-5" />}
                  title="No customers found"
                  description="Customer details bookings se generate hote hain. Booking aate hi yahan customer name, bookings aur spend dikhega."
                />
              )}
            </div>
          </Card>
        </section>

        <section id="admin-analytics" className="mt-8 scroll-mt-32">
          <EmptyPanel
            icon={<BarChart3 className="h-5 w-5" />}
            title="Analytics / Reports"
            description={`Track revenue, completion ratio, cancelled bookings, and high-demand services for HomeCare operations.`}
          />
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          <Card className="rounded-xl border-orange-100">
            <h2 className="text-lg font-bold text-slate-900">
              Recent Payments
            </h2>
            <div className="mt-4 grid max-h-[380px] gap-2 overflow-y-auto pr-1">
              {payments.length ? (
                payments.slice(0, 10).map((payment) => (
                  <div
                    key={payment._id}
                    className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div className="min-w-0">
                      <strong className="text-sm text-slate-900">
                        {money(payment.amount)}
                      </strong>
                      <p className="truncate text-xs text-slate-500">
                        {payment.paymentMethod} -{" "}
                        {payment.transactionId || "No transaction"}
                      </p>
                    </div>
                    <span
                      className={`w-fit ${statusPillClass(payment.paymentStatus)}`}
                    >
                      {payment.paymentStatus}
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-500">
                  No payments.
                </div>
              )}
            </div>
          </Card>

          <Card className="rounded-xl border-orange-100">
            <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
            <div className="mt-4 grid gap-3">
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
                <strong>{bookingCounts.pending}</strong> bookings are waiting
                for assignment.
              </div>
              <div className="rounded-xl border border-orange-100 bg-orange-50 p-4 text-sm text-orange-900">
                <strong>{bookingCounts.completed}</strong> bookings have been
                completed.
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
                <CheckCircle2
                  className="mr-2 inline h-4 w-4 text-orange-600"
                  aria-hidden
                />
                Admin profile and settings actions are available from the
                profile dropdown.
              </div>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
