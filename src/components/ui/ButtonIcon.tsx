import type React from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface ButtonIconProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  children?: React.ReactNode;
  iconClassName?: string;
}

export const ButtonIcon: React.FC<ButtonIconProps> = ({
  icon: Icon,
  children,
  className,
  iconClassName,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-300',
        'bg-neutral-800 text-white hover:bg-neutral-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        // Si no tiene texto, mantiene el tamaño circular estándar (w-10 h-10)
        // Si tiene texto, añade padding horizontal para que respire
        !children ? 'w-10 h-10' : 'px-4 py-2 text-sm',
        className
      )}
      {...props}
    >
      {Icon && <Icon className={cn('w-5 h-5 flex-shrink-0', iconClassName)} />}
      {children && <span>{children}</span>}
    </button>
  );
};