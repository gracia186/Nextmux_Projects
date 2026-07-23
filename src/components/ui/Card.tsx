import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  strong?: boolean;
  hover?: boolean;
  index?: number;
}

export function Card({ children, className, strong, hover, index, style, ...rest }: CardProps) {
  return (
    <div
      className={clsx('glass', 'lazy-in', strong && 'glass-strong', hover && 'ring-hover', className)}
      style={{ ...(style || {}), ['--lazy-i' as string]: index ?? 0 }}
      {...rest}
    >
      {children}
    </div>
  );
}
