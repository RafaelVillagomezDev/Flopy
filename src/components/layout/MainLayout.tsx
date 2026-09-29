import { Outlet } from 'react-router-dom';

export const MainLayout : React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      
     
        {/* 🌟 EL OUTLET: La única zona que hace scroll */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 pb-32">
          <Outlet /> 
        </main>
      

     

    </div>
  );
};