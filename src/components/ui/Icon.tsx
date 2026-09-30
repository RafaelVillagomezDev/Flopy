import { type LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import type { ReactNode } from "react";

interface IconProps {
  to: string;
  className?: string;
  icon: LucideIcon; 
  children?:ReactNode
}

export const Icon: React.FC<IconProps> = ({ icon: IconComponent,to,className ,children}) => {
    return (

        <NavLink to={to} className={className}  >
            <IconComponent/>
            {children}
        </NavLink>
        
    );
}