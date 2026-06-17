import { MapPin } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { Field } from "../ui/Field.jsx";

export function Address({ addresses, loading, addAddress }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-12">
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card>
          <h2 className="text-xl font-bold text-slate-900">Add address</h2>
          <p className="mt-1 text-sm text-slate-600">Save once — reuse while booking any service.</p>
          <form className="mt-6 grid gap-4" onSubmit={addAddress}>
            <Field label="Line 1">
              <input name="line1" required />
            </Field>
            <Field label="Line 2">
              <input name="line2" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City">
                <input name="city" required />
              </Field>
              <Field label="State">
                <input name="state" required />
              </Field>
            </div>
            <Field label="Pincode">
              <input name="pincode" pattern="[0-9]{6}" required />
            </Field>
            <Button variant="primary" disabled={loading} type="submit">
              Save address
            </Button>
          </form>
        </Card>
        <Card className="h-fit">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
            <MapPin className="h-5 w-5" aria-hidden />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Saved addresses</h3>
          <div className="mt-4 grid gap-3">
            {addresses.length ? (
              addresses.map((address) => (
                <div key={address._id} className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                  <strong className="text-slate-900">{address.line1}</strong>
                  <p className="mt-1 text-sm text-slate-600">
                    {address.city}, {address.state} — {address.pincode}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-500">
                No saved address yet.
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
