import React from "react";
import { classNames } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={classNames(
            "w-full px-4 py-2.5 border-2 rounded-xl text-sm transition-all duration-200",
            "focus:outline-none focus:ring-4",
            "placeholder:text-gray-400",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
              : "border-gray-200 focus:border-brand-500 focus:ring-brand-100",
            className
          )}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1.5 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="text-gray-400 text-sm mt-1.5">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
