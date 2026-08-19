'use client';

import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60',
          variant === 'primary' &&
            'bg-brand text-white shadow-glow hover:bg-brand-hover',
          variant === 'secondary' &&
            'border border-ink-500 bg-ink-800 text-mist-100 hover:border-brand/40 hover:bg-ink-700 hover:text-mist-50',
          variant === 'ghost' && 'text-mist-300 hover:bg-ink-800 hover:text-mist-50',
          className,
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  },
);
Button.displayName = 'Button';
