import { ArrowLeft, CalendarDays } from "lucide-react";
import { money, titleCase } from "../../lib/format.js";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { Field } from "../ui/Field.jsx";

export function Service({
  service,
  selectedVariant,
  setSelectedVariant,
  addresses,
  token,
  role,
  go,
  createBooking,
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl ">{titleCase(service?.categoryName || "Service")}</h2>
          <p className="mt-1 text-slate-600">Select a variant, then schedule your visit.</p>
        </div>
        <Button variant="secondary" type="button" onClick={() => go("home")}>
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to services
        </Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <Card>
          <h3 className="text-lg font-bold text-slate-900">Variants</h3>
          <div className="mt-4 grid gap-3 ">
            {service?.variants?.length ? (
              service.variants.map((variant) => (
                <div
                  key={variant._id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 transition hover:border-orange-200 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <strong className="text-slate-900">{titleCase(variant.variantName || "Variant")}</strong>
                    <p className="mt-1 text-sm text-slate-500">Professional visit & support</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 ">
                    <span className="text-lg font-black text-slate-900">{money(variant.variantPrice)}</span>
                    <Button
                      variant={selectedVariant?._id === variant._id ? "primary" : "secondary"}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                    >
                      {selectedVariant?._id === variant._id ? "Selected" : "Select"}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-500">No variants found.</div>
            )}
          </div>
        </Card>
        <Card className="h-fit lg:sticky lg:top-24">
          <h3 className="text-lg font-bold text-slate-900">Book service</h3>
          {token && role === "customer" ? (
            <form className="mt-4 grid gap-4" onSubmit={createBooking}>
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                {selectedVariant ? (
                  <>
                    <span className="font-semibold">{selectedVariant.variantName}</span>
                    <span className="text-amber-800"> — {money(selectedVariant.variantPrice)}</span>
                  </>
                ) : (
                  "Please select a variant first."
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Date">
                  <input type="date" name="bookingDate" required />
                </Field>
                <Field label="Time">
                  <input type="time" name="bookingTime" required />
                </Field>
              </div>
              {addresses.length > 0 && (
                <Field label="Saved address">
                  <select name="savedAddressId" defaultValue="">
                    <option value="">Use new address</option>
                    {addresses.map((address) => (
                      <option key={address._id} value={address._id}>
                        {address.line1}, {address.city}
                      </option>
                    ))}
                  </select>
                </Field>
              )}
              <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">New address</p>
                <Field label="House / flat / street">
                  <input name="line1" placeholder="House no, street, area" />
                </Field>
                <Field label="Landmark">
                  <input name="line2" placeholder="Nearby landmark" />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="City">
                    <input name="city" />
                  </Field>
                  <Field label="State">
                    <input name="state" />
                  </Field>
                </div>
                <Field label="Pincode">
                  <input name="pincode" pattern="[0-9]{6}" />
                </Field>
              </div>
              <Button variant="primary" type="submit">
                <CalendarDays className="h-4 w-4" aria-hidden />
                Create booking
              </Button>
              <Button variant="secondary" type="button" onClick={() => go("address")}>
                Manage addresses
              </Button>
            </form>
          ) : (
            <div className="mt-4 space-y-4">
              <p className="text-sm text-slate-600">Log in as a customer to book this service.</p>
              <Button variant="primary" type="button" onClick={() => go("auth")}>
                Login to book
              </Button>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
