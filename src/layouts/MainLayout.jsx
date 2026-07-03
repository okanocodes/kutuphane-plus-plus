import { Outlet } from 'react-router-dom';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <NavBar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
