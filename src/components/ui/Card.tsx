import React from "react";
import { classNames } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  gradient?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, hover = false, gradient = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={classNames(
          "rounded-2xl border transition-all duration-300",
          gradient
            ? "bg-gradient-to-br from-white to-brand-50/30 border-brand-100"
            : "bg-white border-gray-100",
          hover && "card-hover",
          "shadow-sm hover:shadow-lg",
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
