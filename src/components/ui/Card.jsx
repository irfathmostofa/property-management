import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Card = forwardRef(
  ({ children, padding = "md", hover = false, className, ...props }, ref) => {
    const paddingClasses = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-xl shadow-sm border border-gray-200",
          paddingClasses[padding],
          hover && "transition-shadow duration-200 hover:shadow-lg",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export const CardHeader = ({ children, className }) => (
  <div className={cn("border-b border-gray-200 pb-4 mb-4", className)}>
    {children}
  </div>
);

export const CardTitle = ({ children, className }) => (
  <h3 className={cn("text-lg font-semibold text-gray-900", className)}>
    {children}
  </h3>
);

export const CardContent = ({ children, className }) => (
  <div className={className}>{children}</div>
);

export const CardFooter = ({ children, className }) => (
  <div className={cn("border-t border-gray-200 pt-4 mt-4", className)}>
    {children}
  </div>
);
