
import React from 'react';
import { cn } from '@/lib/utils';
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from "@/components/ui/button";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const variantMapping: Record<ButtonProps['variant'] & string, ShadcnButtonProps['variant']> = {
  primary: "default",
  secondary: "secondary",
  outline: "outline",
  ghost: "ghost"
};

const sizeMapping: Record<ButtonProps['size'] & string, ShadcnButtonProps['size']> = {
  sm: "sm",
  md: "default",
  lg: "lg"
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, fullWidth, isLoading, ...props }, ref) => {
    return (
      <ShadcnButton
        className={cn(
          fullWidth ? 'w-full' : '',
          className
        )}
        variant={variantMapping[variant]}
        size={sizeMapping[size]}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </ShadcnButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;
