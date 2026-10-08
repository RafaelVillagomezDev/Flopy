import { SideNavLayout } from '@/components/layout/SideNavLayout';
import { NavListLayout } from '@/components/layout/NavListLayout';
import { Home as HomeIcon } from 'lucide-react';

export const Sidebar: React.FC = () => {
    return (
        <SideNavLayout>
            <NavListLayout>
                {/* Sección Principal */}
                <NavListLayout.Item to="/" textLink="Inicio" icon={HomeIcon} />
            </NavListLayout>
        </SideNavLayout>
    );
};