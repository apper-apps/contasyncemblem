import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  disabled = false,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-accent text-white hover:from-accent hover:to-primary shadow-lg hover:shadow-xl",
    secondary: "bg-white text-secondary border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
    outline: "border border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-secondary hover:bg-gray-100",
    success: "bg-gradient-to-r from-success to-emerald-500 text-white hover:from-emerald-500 hover:to-success",
    warning: "bg-gradient-to-r from-warning to-yellow-500 text-white hover:from-yellow-500 hover:to-warning",
    error: "bg-gradient-to-r from-error to-red-500 text-white hover:from-red-500 hover:to-error"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;