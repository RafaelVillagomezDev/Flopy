import React, { useState } from 'react';
import { X, Siren } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface StickyBannerProps {
    message?: string;
    actionText?: string;
    onAction?: () => void;
}

export const StickyBanner: React.FC<StickyBannerProps> = ({
    message = "Nueva versión disponible con mejoras de audio",
    actionText,
}) => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <aside
            aria-label="Aviso destacado"
            className="absolute top-4 left-1/2 -translate-x-1/2 z-40 w-auto max-w-sm md:max-w-xl
                 flex items-center gap-3 px-4 py-2.5 
                 bg-[#202020]/90 text-white rounded-full 
                 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] 
                 backdrop-blur-md transition-all duration-300 ease-out select-none"
        >
            <Siren size={16} className="text-brand-red shrink-0" />

            <p className="text-xs md:text-sm font-medium text-neutral-200 truncate">
                {message}
            </p>

            {actionText && (
                <NavLink
                    to={"https://github.com/RafaelVillagomezDev/Flopy"}
                    
                    className="text-xs font-semibold text-white underline underline-offset-2 hover:text-neutral-300 transition-colors shrink-0 ml-1"
                >
                    {actionText}
                </NavLink>
            )}

   
            <button
                type="button"
                aria-label="Cerrar aviso"
                onClick={() => setIsVisible(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors ml-auto shrink-0"
            >
                <X size={14} />
            </button>
        </aside>
    );
};