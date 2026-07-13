import { statusPillClass } from "../../lib/statusStyles.js";
import { money, titleCase } from "../../lib/format.js";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { Field } from "../ui/Field.jsx";

export function Agent({
  bookings,
  services = [],
  agentWallet,
  profileId,
  loading,
  loadBookings,
  loadAgentServices,
  loadAgentWallet,
  createAgentService,
  updateBooking,
}) {
  const cancelBooking = (bookingId) => {
    updateBooking(bookingId, "cancel", { cancelReason: "Cancelled by agent" });
  };

  const refresh = () => {
    loadBookings();
    loadAgentServices();
    loadAgentWallet();
  };
 

  const wallet = agentWallet || {};
  const walletHistory = wallet.history || [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Agent dashboard
          </h2>
          <p className="mt-1 text-slate-600">
            Accept, run, and complete assigned jobs.
          </p>
        </div>
        <Button variant="secondary" type="button" onClick={refresh}>
          Refresh
        </Button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm font-semibold text-slate-500">Wallet income</p>
          <strong className="mt-2 block text-2xl text-slate-900">
            {money(wallet.walletBalance)}
          </strong>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-slate-500">Total repaired</p>
          <strong className="mt-2 block text-2xl text-slate-900">
            {wallet.totalServicesRepaired || 0}
          </strong>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-slate-500">GST collected</p>
          <strong className="mt-2 block text-2xl text-slate-900">
            {money(wallet.totalGst)}
          </strong>
        </Card>
      </div>

      <h3 className="mb-4 text-lg font-bold text-slate-900">
        Repair income history
      </h3>
      <div className="mb-8 grid gap-3">
        {walletHistory.length ? (
          walletHistory.map((item) => (
            <div
              key={item.bookingId}
              className="grid gap-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm lg:grid-cols-[1fr_auto]"
            >
              <div>
                <strong className="text-slate-900">
                  {item.serviceName || "Service"} -{" "}
                  {item.variantName || "Variant"}
                </strong>
                <p className="mt-1 text-sm text-slate-500">
                  {item.customerName || "Customer"}{" "}
                  {item.completedAt
                    ? `- ${new Date(item.completedAt).toLocaleDateString("en-IN")}`
                    : ""}
                </p>
                <p className="mt-2 text-xs text-slate-500 [overflow-wrap:anywhere]">
                  {item.paymentMethod} -{" "}
                  {item.transactionId || "No transaction"}
                </p>
              </div>
              <div className="grid gap-1 text-sm text-slate-600 sm:min-w-64">
                <div className="flex justify-between gap-4">
                  <span>Service price</span>
                  <strong>{money(item.baseAmount)}</strong>
                </div>
                <div className="flex justify-between gap-4">
                  <span>GST ({item.gstRate || 18}%)</span>
                  <strong>{money(item.gstAmount)}</strong>
                </div>
                <div className="flex justify-between gap-4 border-t border-slate-100 pt-1">
                  <span>Total paid</span>
                  <strong>{money(item.totalAmount)}</strong>
                </div>
                <div className="flex justify-between gap-4 text-orange-700">
                  <span>Your income</span>
                  <strong>{money(item.agentIncome)}</strong>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center text-slate-500">
            Complete paid repairs will appear here.
          </div>
        )}
      </div>

      <h3 className="mb-4 text-lg font-bold text-slate-900">Bookings</h3>
      <div className="grid gap-3">
        {bookings.length ? (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <strong className="text-lg text-slate-900">
                  {booking.serviceName ||
                    booking.serviceId?.categoryName ||
                    "Service"}
                </strong>
                <p className="mt-1 text-sm text-slate-500">
                  {booking.variantName || "Variant"} for{" "}
                  {booking.customerId?.fullName || "Customer"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={statusPillClass(booking.status)}>
                  {booking.status}
                </span>
                {booking.status === "PENDING" && (
                  <Button
                    variant="primary"
                    type="button"
                    onClick={() =>
                      updateBooking(booking._id, "accept", {
                        agentId: profileId,
                      })
                    }
                  >
                    Accept
                  </Button>
                )}
                {booking.status === "ACCEPTED" && (
                  <Button
                    variant="primary"
                    type="button"
                    onClick={() => updateBooking(booking._id, "start")}
                  >
                    Start
                  </Button>
                )}
                {booking.status === "ONGOING" && (
                  <Button
                    variant="primary"
                    type="button"
                    onClick={() => updateBooking(booking._id, "complete")}
                  >
                    Complete
                  </Button>
                )}
                {["PENDING", "ACCEPTED", "ONGOING"].includes(
                  booking.status,
                ) && (
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => cancelBooking(booking._id)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center text-slate-500">
            No assigned bookings.
          </div>
        )}
      </div>
    </section>
  );
}
