import { cn } from "@/utils/cn";

export default function GlassCard({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "glass rounded-2xl overflow-hidden shadow-2xl relative group transition-all duration-500 hover:shadow-brand/20",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
