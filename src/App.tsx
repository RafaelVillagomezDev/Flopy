import { RouterProvider } from 'react-router-dom';
import { router } from './routes/index'; // Aquí dentro es donde vive el MainLayout

function App() {
  return (
    // Si mañana añades un ThemeProvider para modo oscuro, o un AuthProvider, irían aquí envolviendo al router
  
    <RouterProvider router={router} />
  );
}

export default App;