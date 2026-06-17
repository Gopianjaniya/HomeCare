export function Field({ label, children }) {
    return (
      <label className="grid gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-600">{label}</span>
        <div className="[&_input]:min-h-[44px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-slate-200 [&_input]:bg-white [&_input]:px-3 [&_input]:outline-none [&_input]:transition [&_input]:focus:border-orange-400 [&_input]:focus:ring-2 [&_input]:focus:ring-orange-100 [&_select]:min-h-[44px] [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:border-slate-200 [&_select]:bg-white [&_select]:px-3 [&_select]:outline-none [&_select]:transition [&_select]:focus:border-orange-400 [&_select]:focus:ring-2 [&_select]:focus:ring-orange-100 [&_textarea]:w-full [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-slate-200 [&_textarea]:bg-white [&_textarea]:p-3 [&_textarea]:outline-none [&_textarea]:transition [&_textarea]:focus:border-orange-400 [&_textarea]:focus:ring-2 [&_textarea]:focus:ring-orange-100">
          {children}
        </div>
      </label>
    );
  }
