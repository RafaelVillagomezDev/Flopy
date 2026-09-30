import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { DashboardMobileLayout } from './DashboardMobileLayout';


export const MainLayout: React.FC = () => {

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  // Escuchamos los cambios de tamaño de la ventana
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isDesktop) {
    return (
      <DashboardLayout>
        <Outlet /> 
      </DashboardLayout>
    );
  }

  return (
     <DashboardMobileLayout>
        <Outlet />
     </DashboardMobileLayout>
  );
};