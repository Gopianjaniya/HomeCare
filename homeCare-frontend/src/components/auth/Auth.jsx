import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { Field } from "../ui/Field.jsx";

export function Auth({ authMode, setAuthMode, role, mobile, loading, submitAuth }) {
  const [selectedRole, setSelectedRole] = useState(role || "customer");
  const isAdmin = selectedRole === "admin";

  return (
    <main className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-slate-900">{authMode === "login" ? "Welcome back" : "Create account"}</h2>
        <p className="mt-2 text-sm text-slate-600">Use your email address and choose your role.</p>
        <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            className={`rounded-lg py-2.5 text-sm font-bold transition ${
              authMode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
            onClick={() => setAuthMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={`rounded-lg py-2.5 text-sm font-bold transition ${
              authMode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
            onClick={() => { setSelectedRole("customer"); setAuthMode("signup"); }}
          >
            Signup
          </button>
        </div>
        <form className="mt-6 grid gap-4" onSubmit={submitAuth}>
          <Field label="Role">
            <select name="role" value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)}>
              <option value="customer">Customer</option>
              <option value="agent">Agent</option>
              {authMode === "login" && <option value="admin">Admin</option>}
            </select>
          </Field>
          {!isAdmin && (
            <Field label="Email">
              <input name="email" type="email" placeholder="you@example.com" required />
            </Field>
          )}
          <Button variant="primary" className="w-full" disabled={loading} type="submit">
            {isAdmin ? "Continue to admin login" : "Send verification email"}
          </Button>
        </form>
        <p className="mt-6 flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-orange-600" aria-hidden />
          We will send a secure 6-digit verification code to your email.
        </p>
      </Card>
    </main>
  );
}
