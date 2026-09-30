import { type ReactNode } from "react";
import { Icon } from "../ui/Icon";


export const BottomListRoot=({ children }: { children: ReactNode }) => {
    return (
        <nav className="flex flex-row gap-1  w-full justify-evenly">
            {children}
        </nav>
    );
}



export const NavListItem=({ to, icon,children }: { to: string; icon: any ,children:ReactNode}) => {
    return (
        <Icon to={to} icon={icon} className="flex flex-col justify-center items-center ">
            {children}
        </Icon>
            
    );
}


export const BottomNavLayout = Object.assign(BottomListRoot,{
    Item:NavListItem,
});

