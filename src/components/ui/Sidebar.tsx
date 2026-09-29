import { SideNavLayout } from '@/components/layout/SideNavLayout';
import { NavListLayout } from '@/components/layout/NavListLayout';
import { Home as HomeIcon, Info, Settings, User, Bell } from 'lucide-react';

export const Sidebar: React.FC = () => {
    return (
        <SideNavLayout>
            <NavListLayout>
                {/* Sección Principal */}
                <NavListLayout.Item to="/" textLink="Inicio" icon={HomeIcon} />
                <NavListLayout.Item to="/profile" textLink="Mi Perfil" icon={User} />
                {/* Sección Secundaria con Título */}
                <NavListLayout.SectionTitle>Cuenta</NavListLayout.SectionTitle>
                <NavListLayout.Item to="/notifications" textLink="Notificaciones" icon={Bell} />
                <NavListLayout.Item to="/settings" textLink="Ajustes" icon={Settings} />
                {/* Otros enlaces (ej. deshabilitado) */}
                <NavListLayout.Item to="/about" textLink="Información" icon={Info} />
            </NavListLayout>
        </SideNavLayout>
    );
};