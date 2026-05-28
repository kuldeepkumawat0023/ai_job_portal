import React from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1.5 w-full">
        {label && (
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-11 w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm placeholder:text-outline focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <span className="text-xs text-red-500 font-semibold px-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
export { Input };
