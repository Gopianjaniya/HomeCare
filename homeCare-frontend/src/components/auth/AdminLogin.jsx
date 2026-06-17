import { Settings, ShieldCheck } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { Field } from "../ui/Field.jsx";

export function AdminLogin({ loading, submitAdminLogin }) {
  return (
    <main className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <Settings className="h-6 w-6" aria-hidden />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Admin login</h2>
        <p className="mt-2 text-sm text-slate-600">Owner-only access to services, bookings, and payments.</p>
        <form className="mt-6 grid gap-4" onSubmit={submitAdminLogin}>
          <Field label="Admin email">
            <input type="email" name="email" placeholder="you@company.com" required />
          </Field>
          <Field label="Password">
            <input type="password" name="password" placeholder="••••••••" required />
          </Field>
          <Button variant="primary" className="w-full" disabled={loading} type="submit">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            Sign in as admin
          </Button>
        </form>
      </Card>
    </main>
  );
}
