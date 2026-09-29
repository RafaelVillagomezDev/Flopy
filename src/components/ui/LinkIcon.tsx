import React from "react";
import { NavLink } from 'react-router-dom';
import { type LucideIcon } from 'lucide-react';

interface LinkIconProps {
  to: string;
  icon: LucideIcon;
  textLink: string;
  className?: string;
  isExternal?: boolean;
}

export const LinkIcon: React.FC<LinkIconProps> = ({ 
  to, 
  icon:Icon, 
  textLink,
  isExternal = false, 
  className = "" 
}) => {
  

  if (isExternal) {
    return (
      <a 
        href={to} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`flex items-center gap-3 px-4 py-2.5 rounded-md font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors duration-200 no-underline ${className}`}
      >
        <span className="flex items-center justify-center w-5 h-5">
          <Icon size={20} />
        </span>
        <span>{textLink}</span>
      </a>
    );
  }


  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center no-underline gap-3 px-4 py-2.5 rounded-md font-semibold transition-colors duration-200  ${
          isActive
            ? 'bg-red-500 text-white shadow-sm'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        } ${className}`
      }
    >
      <span className="flex items-center justify-center w-5 h-5">
        <Icon size={20} />
      </span>
      <span>{textLink}</span>
    </NavLink>
  );
};