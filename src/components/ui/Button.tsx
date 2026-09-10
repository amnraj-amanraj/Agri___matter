'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'amber' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 shadow-sm hover:-translate-y-0.5";

  const variantStyles = {
    primary: "bg-gradient-to-r from-agri-green-700 to-emerald-600 hover:from-agri-green-800 hover:to-emerald-700 text-white focus:ring-agri-green-600 shadow-lg shadow-emerald-200/60",
    secondary: "bg-gradient-to-r from-agri-brown-700 to-stone-700 hover:from-agri-brown-800 hover:to-stone-800 text-white focus:ring-agri-brown-600",
    outline: "border-2 border-agri-green-700 text-agri-green-800 hover:bg-agri-green-50 focus:ring-agri-green-600 bg-white/90 backdrop-blur-sm",
    amber: "bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-500 text-black focus:ring-amber-500 shadow-lg shadow-amber-200/60",
    danger: "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white focus:ring-red-500"
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs font-semibold",
    md: "px-4 py-2.5 text-sm font-bold min-h-[44px]", // farmer friendly touch target
    lg: "px-6 py-3.5 text-base font-bold min-h-[52px]" // extra large mobile button
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
