"use client";
import type React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "font-medium rounded-lg transition-all duration-200 flex items-center justify-center";

  const sizeStyles = {
    sm: "text-xs px-3 py-1 gap-1",
    md: "text-sm px-4 py-1 gap-1.5",
    lg: "text-base px-5 py-2.5 gap-2",
  };

  const variantStyles = {
    primary:
      "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 focus:ring-offset-black",
    secondary:
      "bg-neutral-800 hover:bg-neutral-700 text-white focus:ring-2 focus:ring-neutral-600 focus:ring-offset-1 focus:ring-offset-black",
    outline:
      "bg-transparent border border-emerald-600 text-emerald-400 hover:bg-emerald-900/20 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 focus:ring-offset-black",
    ghost:
      "bg-transparent text-neutral-300 hover:bg-neutral-800 focus:ring-2 focus:ring-neutral-700 focus:ring-offset-1 focus:ring-offset-black",
  };

  const disabledStyles = "opacity-50 cursor-not-allowed pointer-events-none";

  const loadingStyles = "relative !text-transparent";

  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <button
      className={`
          ${baseStyles}
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          ${disabled || isLoading ? disabledStyles : ""}
          ${isLoading ? loadingStyles : ""}
          ${widthStyles}
          ${className}
        `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}

      {leftIcon && !isLoading && (
        <span className="button-icon">{leftIcon}</span>
      )}
      <span>{title}</span>
      {rightIcon && !isLoading && (
        <span className="button-icon">{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
