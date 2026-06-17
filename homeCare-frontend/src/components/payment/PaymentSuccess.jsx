import { CheckCircle2 } from "lucide-react";
import { money } from "../../lib/format.js";
import { statusPillClass } from "../../lib/statusStyles.js";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";

export function PaymentSuccess({ payment, go }) {
  return (
    <main className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-orange-600" aria-hidden />
        <h2 className="mt-4 text-2xl font-bold text-slate-900">Booking confirmed</h2>
        <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-left">
          <div>
            <strong className="text-xl text-slate-900">{money(payment?.amount)}</strong>
            <p className="mt-1 text-xs text-slate-500 [overflow-wrap:anywhere]">TXN: {payment?.transactionId || "—"}</p>
          </div>
          <span className={statusPillClass(payment?.paymentStatus)}>{payment?.paymentStatus || "SUCCESS"}</span>
        </div>
        <Button variant="primary" className="mt-8 w-full" type="button" onClick={() => go("bookings")}>
          View my bookings
        </Button>
      </Card>
    </main>
  );
}
