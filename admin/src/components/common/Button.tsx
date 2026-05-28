import React from 'react';
import { cn } from '@/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  glow?: boolean;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, glow, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-on-primary hover:opacity-90 active:scale-[0.98]',
      secondary: 'bg-secondary text-on-secondary hover:opacity-90 active:scale-[0.98]',
      gradient: 'gradient-button text-white hover:opacity-95 active:scale-[0.98]',
      danger: 'bg-red-600 text-white hover:bg-red-500 active:scale-[0.98]',
      outline: 'border border-outline-variant bg-transparent text-on-surface hover:bg-surface-container-low active:scale-[0.98]',
      ghost: 'hover:bg-surface-container-low text-on-surface-variant active:scale-[0.98]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs rounded-lg',
      md: 'px-5 py-2.5 text-sm rounded-xl',
      lg: 'px-8 py-3.5 text-base rounded-2xl',
      icon: 'p-2 rounded-lg',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || !!disabled}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all focus:outline-none disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
          variants[variant as keyof typeof variants] || variants.primary,
          sizes[size as keyof typeof sizes] || sizes.md,
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
