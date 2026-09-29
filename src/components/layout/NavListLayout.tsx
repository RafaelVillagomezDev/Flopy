import { LinkIcon } from "@/components/ui/LinkIcon";
import type { ReactNode } from "react";


const NavListRoot = ({ children }: { children: ReactNode }) => {
    return (
        <nav className="flex flex-col gap-1  w-full">
            {children}
        </nav>
    );
}

const NavListItem = ({ to, icon, textLink, isExternal = false }: { to: string; icon: any; textLink: string; isExternal?: boolean }) => {
    return (
        <LinkIcon to={to} icon={icon} textLink={textLink} isExternal={isExternal} />
    );
}

const SectionTitle = ({ children }: { children: ReactNode }) => (
    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-4 mt-4 mb-2">
        {children}
    </h3>
);

export const NavListLayout = Object.assign(NavListRoot, {
    Item: NavListItem,
    SectionTitle: SectionTitle,
});