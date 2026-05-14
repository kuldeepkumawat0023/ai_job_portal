import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, HTMLMotionProps } from 'framer-motion';

import { cn } from '@/utils/cn';


export interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'ref'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  glow?: boolean;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, glow, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-on-primary hover:opacity-90',
      secondary: 'bg-secondary text-on-secondary hover:opacity-90',
      gradient: 'bg-gradient-to-r from-primary to-secondary text-white',
      outline: 'border border-outline-variant bg-transparent text-on-surface hover:bg-surface-container-low',
      ghost: 'hover:bg-surface-container-low text-on-surface-variant',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-10 py-4 text-lg',
      icon: 'p-2',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading || !!disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-bold transition-all focus:outline-none disabled:pointer-events-none disabled:opacity-50',
          glow && 'button-glow',
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
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
