import { CheckCircle2, CircleAlert, X } from "lucide-react";

export function Toast({ toasts, dismissToast }) {
  if (!toasts.length) return null;

  return (
    <div
      className="pointer-events-none fixed left-3 right-3 top-20 z-50 mx-auto grid max-w-md gap-2 sm:left-auto sm:right-6 sm:top-24 sm:w-full"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border bg-white p-3 shadow-lift ${
            toast.type === "error"
              ? "border-rose-200 text-rose-800"
              : "border-orange-200 text-orange-900"
          }`}
        >
          <span className="inline-flex shrink-0">
            {toast.type === "error" ? (
              <CircleAlert className="h-5 w-5" aria-hidden />
            ) : (
              <CheckCircle2 className="h-5 w-5" aria-hidden />
            )}
          </span>
          <span className="min-w-0 text-sm font-semibold leading-snug [overflow-wrap:anywhere]">{toast.text}</span>
          <button
            type="button"
            className="inline-grid h-8 w-8 place-items-center rounded-lg text-current hover:bg-black/5"
            onClick={() => dismissToast(toast.id)}
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
