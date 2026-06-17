import { money } from "../../lib/format.js";
import { statusPillClass } from "../../lib/statusStyles.js";
import { Button } from "../ui/Button.jsx";

export function Bookings({ bookings, loadBookings, updateBooking }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">My bookings</h2>
          <p className="mt-1 text-slate-600">Your visits and payment status in one place.</p>
        </div>
        <Button variant="secondary" type="button" onClick={() => loadBookings()}>
          Refresh
        </Button>
      </div>
      <div className="grid gap-3">
        {bookings.length ? (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-orange-200 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <strong className="text-lg text-slate-900">
                  {booking.serviceName || booking.serviceId?.categoryName || "Service"}
                </strong>
                <p className="mt-1 text-sm text-slate-500">
                  {booking.variantName || "Variant"} on {booking.bookingDate} at {booking.bookingTime}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-lg font-black text-slate-900">{money(booking.price)}</span>
                <span className={statusPillClass(booking.status)}>{booking.status}</span>
                {["PENDING", "ACCEPTED"].includes(booking.status) && (
                  <Button
                    variant="danger"
                    type="button"
                    onClick={() => updateBooking(booking._id, "cancel", { cancelReason: "Cancelled by customer" })}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center text-slate-500">No bookings yet.</div>
        )}
      </div>
    </section>
  );
}
