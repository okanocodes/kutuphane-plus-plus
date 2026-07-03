import { Outlet } from 'react-router-dom';
import NavBar from '../components/Navbar';

// DashboardLayout handles user profile, reservations, and admin dashboard
// It uses a two-column structure with the Sidebar on the left and content on the right.
import Sidebar from '../components/Sidebar';

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <NavBar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-grow p-md md:p-lg lg:p-xl w-full max-w-[calc(100vw-256px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
