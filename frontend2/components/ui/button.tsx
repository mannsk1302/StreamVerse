import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const sizes = {
      sm: "px-2 py-1 text-sm",
      md: "px-4 py-2",
      lg: "px-5 py-3 text-lg"
    };

    return (
      <button
        ref={ref}
        className={cn(
          "rounded-md font-medium transition-colors",
          variant === "default" && "bg-blue-600 text-white hover:bg-blue-700",
          variant === "outline" && "border border-gray-300 hover:bg-gray-50",
          variant === "ghost" && "hover:bg-gray-100",
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
