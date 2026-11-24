import { cn } from "@/lib/utils";

const base = "w-full rounded-md border border-line bg-white px-3 text-sm text-ink placeholder:text-muted/70 focus-visible:outline-2 focus-visible:outline-primary";
export const Input = ({ className, ...p }) => <input className={cn(base, "h-10", className)} {...p} />;
export const Textarea = ({ className, ...p }) => <textarea className={cn(base, "py-2 min-h-24", className)} {...p} />;
export const Select = ({ className, children, ...p }) => <select className={cn(base, "h-10", className)} {...p}>{children}</select>;
export const Label = ({ className, ...p }) => <label className={cn("text-sm font-medium text-ink", className)} {...p} />;
export const Field = ({ label, htmlFor, hint, children }) => (
  <div className="grid gap-1.5">
    <Label htmlFor={htmlFor}>{label}</Label>
    {children}
    {hint && <p className="text-xs text-muted">{hint}</p>}
  </div>
);
