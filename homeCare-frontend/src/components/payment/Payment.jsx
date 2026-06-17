import { CreditCard, IndianRupee } from "lucide-react";
import { money } from "../../lib/format.js";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { Field } from "../ui/Field.jsx";

export function Payment({ booking, loading, createPayment }) {
  return (
    <main className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-700">
          <CreditCard className="h-6 w-6" aria-hidden />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Complete payment</h2>
        <p className="mt-2 text-sm text-slate-600">
          {booking?.serviceName || "Service"} — {booking?.variantName || "Variant"}
        </p>
        <p className="mt-4 text-3xl font-black text-slate-900">{money(booking?.price)}</p>
        <form className="mt-6 grid gap-4" onSubmit={createPayment}>
          <Field label="Payment method">
            <select name="paymentMethod">
              <option value="COD">Cash on delivery</option>
              <option value="ONLINE">Online</option>
            </select>
          </Field>
          <Button variant="primary" className="w-full" disabled={loading} type="submit">
            <IndianRupee className="h-4 w-4" aria-hidden />
            Pay now
          </Button>
        </form>
      </Card>
    </main>
  );
}
