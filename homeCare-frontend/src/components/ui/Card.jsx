export function Card({ children, className = "", ...props }) {
    return (
      <div
        className={`rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-soft backdrop-blur-sm ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
