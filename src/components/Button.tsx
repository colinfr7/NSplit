
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, fullWidth, isLoading, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-nsplit-500 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      primary: 'bg-nsplit-600 text-white shadow-sm hover:bg-nsplit-700',
      secondary: 'bg-nsplit-100 text-nsplit-800 hover:bg-nsplit-200',
      outline: 'border border-nsplit-200 bg-transparent hover:bg-nsplit-50 text-nsplit-800',
      ghost: 'bg-transparent text-nsplit-800 hover:bg-nsplit-50',
    };
    
    const sizes = {
      sm: 'text-xs px-3 py-1.5 h-8',
      md: 'text-sm px-4 py-2 h-10',
      lg: 'text-base px-5 py-2.5 h-12',
    };
    
    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth ? 'w-full' : '',
          className
        )}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
