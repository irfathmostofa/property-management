import { cn } from "../../lib/utils";

const badgeVariants = {
  variant: {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    default: "bg-gray-100 text-gray-800",
  },
  size: {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-2 py-1 text-sm",
  },
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        badgeVariants.variant[variant],
        badgeVariants.size[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
