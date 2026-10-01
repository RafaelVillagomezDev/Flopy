import type React from 'react';
import { cn } from '@/utils/cn';

interface CardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const CardLayout: React.FC<CardLayoutProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
        'justify-center gap-4 p-4',
        '[&>*]:max-w-[250px] [&>*]:w-full',
        className
      )}
    >
      {children}
    </div>
  );
};