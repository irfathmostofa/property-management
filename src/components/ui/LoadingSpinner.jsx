import { cn } from "../../lib/utils";

export function LoadingSpinner({
  size = "md",
  color = "primary",
  className = "",
}) {
  const sizes = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const colors = {
    primary: "border-t-primary-600",
    white: "border-t-white",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-4 border-gray-200",
          sizes[size],
          colors[color],
        )}
      />
    </div>
  );
}
