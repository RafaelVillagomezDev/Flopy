import { Outlet } from 'react-router-dom';

export const MainLayout : React.FC = () => {
  return (
    <div className="flex h-screen text-slate-100 overflow-hidden font-sans">
      
        
        <main className="flex-1 overflow-y-auto ">
          <Outlet /> 
        </main>
    
    </div>
  );
};