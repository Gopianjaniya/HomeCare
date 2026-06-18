import { useEffect, useState } from "react";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { Field } from "../ui/Field.jsx";

export function Otp({ mobile, otpHint, loading, verifyOtp, resendOtp }) {
  const [secondsLeft, setSecondsLeft] = useState(30);

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const timer = window.setTimeout(() => setSecondsLeft((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  const handleResend = async () => {
    if (secondsLeft > 0 || loading) return;
    await resendOtp();
    setSecondsLeft(30);
  };

  return (
    <main className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-slate-900">Verify OTP</h2>
        <p className="mt-2 text-sm text-slate-600">We sent a real-time code to {mobile}.</p>
        {otpHint && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Development OTP: <strong>{otpHint}</strong>
          </div>
        )}
        <form className="mt-6 grid gap-4" onSubmit={verifyOtp}>
          <Field label="OTP">
            <input name="otp" maxLength="6" inputMode="numeric" placeholder="6-digit code" required />
          </Field>
          <Button variant="primary" className="w-full" disabled={loading} type="submit">
            Verify & continue
          </Button>
        </form>
        <button
          type="button"
          className="mt-4 w-full text-sm font-semibold text-orange-700 disabled:cursor-not-allowed disabled:text-slate-400"
          disabled={loading || secondsLeft > 0}
          onClick={handleResend}
        >
          {secondsLeft > 0 ? `Resend OTP in ${secondsLeft}s` : "Resend OTP"}
        </button>
      </Card>
    </main>
  );
}
