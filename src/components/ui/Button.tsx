import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { Spinner } from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'md' | 'sm';
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({
  variant = 'primary', size = 'md', loading, icon, children, className, disabled, ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx('btn', `btn-${variant}`, size === 'sm' && 'btn-sm', className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Spinner size={size === 'sm' ? 14 : 16} /> : icon}
      {children}
    </button>
  );
}
