import React from 'react';
import { type LucideIcon, Loader2 } from 'lucide-react';
import {IconBase} from '@/components/ui/IconBase';

export interface LoaderStateProps {
  children?: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export const Loader: React.FC<LoaderStateProps> = ({
  children,
  icon: Icon = Loader2,
  className = '',
}) => {
  return (
    <div
      role="status"
      aria-label={typeof children === 'string' ? children : 'Cargando'}
      className={`flex flex-col sm:flex-row items-center justify-center gap-3 p-6 text-card-text-muted ${className}`}
    >
 
      <IconBase className="size-5 animate-spin text-brand-red shrink-0" aria-hidden="true" icon={Icon} />

      {/* Texto opcional vía children */}
      {children && (
        <span className="text-sm font-medium tracking-wide text-card-text-primary">
          {children}
        </span>
      )}


      <div className="flex items-center gap-1.5 ml-1">
        <span
          className="size-1.5 rounded-full bg-brand-red animate-ping"
          aria-hidden="true"
        />
        <span
          className="size-1.5 rounded-full bg-brand-red animate-ping [animation-delay:200ms]"
          aria-hidden="true"
        />
        <span
          className="size-1.5 rounded-full bg-brand-red animate-ping [animation-delay:400ms]"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};