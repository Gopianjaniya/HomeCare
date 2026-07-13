import { MailCheck } from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { Button } from "../ui/Button.jsx";
import { Field } from "../ui/Field.jsx";

export function EmailVerification({ email, loading, verifyEmail, resendCode }) {
  return <main className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4 py-12"><Card className="w-full max-w-md p-8 text-center"><MailCheck className="mx-auto h-12 w-12 text-orange-600" /><h2 className="mt-4 text-2xl font-bold text-slate-900">Verify your email</h2><p className="mt-3 text-sm leading-6 text-slate-600">We sent a 6-digit code to <strong>{email}</strong>.</p><form className="mt-6 grid gap-4 text-left" onSubmit={verifyEmail}><Field label="Verification code"><input name="code" maxLength="6" inputMode="numeric" pattern="[0-9]{6}" placeholder="6-digit code" required /></Field><Button variant="primary" disabled={loading} type="submit">Verify code</Button></form><Button className="mt-3" variant="secondary" disabled={loading} type="button" onClick={resendCode}>Resend code</Button></Card></main>;
}
