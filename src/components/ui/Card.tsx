import React from "react";
import { classNames } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  gradient?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, hover = false, gradient = false, padding = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={classNames(
          "rounded-2xl border transition-all duration-300",
          gradient
            ? "bg-gradient-to-br from-white to-brand-50/30 border-brand-100"
            : "bg-white border-gray-100",
          hover && "card-hover",
          "shadow-sm",
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
