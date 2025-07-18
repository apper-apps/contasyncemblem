import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className, 
  variant = "default",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white border border-gray-200 shadow-card",
    premium: "bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-premium",
    glass: "bg-white/80 backdrop-blur-sm border border-white/20 shadow-floating"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg p-6 transition-all duration-200 hover:shadow-lg",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

export default Card;