import { BottomNavLayout } from '../layout/BottomNavLayout';
import { Home as HomeIcon, Search, Library, Plus } from 'lucide-react';

export const BottomNav: React.FC = () => {
    return (
        <BottomNavLayout>
            <BottomNavLayout.Item to="/" icon={HomeIcon} >
                <span>Inicio</span>
            </BottomNavLayout.Item>
            <BottomNavLayout.Item to="/" icon={Search} >
                <span>Buscar</span>
            </BottomNavLayout.Item>
            <BottomNavLayout.Item to="/" icon={Library}>
                <span>Biblioteca</span>
            </BottomNavLayout.Item>
            <BottomNavLayout.Item to="/" icon={Plus}>
                <span>Añadir</span>
            </BottomNavLayout.Item>
        </BottomNavLayout>
    );
}