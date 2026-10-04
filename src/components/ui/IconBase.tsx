import { type LucideIcon } from 'lucide-react';


interface IconBaseProps {
    icon: LucideIcon;
    size?: number;
    color?: string;
    className?: string;
}

export const IconBase:React.FC<IconBaseProps> = ({ icon: Icon, size, color, className }) => {

    return (
        <Icon className={className} size={size} color={color} />
    )
}