import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StudyDeskPage from './pages/StudyDeskPage';
import useAuth from './hooks/useAuth';
import MeetingRoomsPage from './pages/MeetingRoomsPage';
import EventsPage from './pages/EventsPage';
import NotificationsPage from './pages/NotificationsPage';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Protected Route Sg
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import BookDetailPage from './pages/BookDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import DigitalLibraryPage from './pages/DigitalLibraryPage';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Private Pages
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ReservationsPage from './pages/ReservationsPage';
import FavoritesPage from './pages/FavoritesPage';
import BorrowedBooksPage from './pages/BorrowedBooksPage';
import AdminPage from './pages/AdminPage';

// Toast Notifications Container
import ToastContainer from './components/Toast';

const classes = ['bg-surface', 'text-on-surface', 'font-body-md', 'overflow-x-hidden'];

const EventsRoute = () => {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated && role === 'admin') {
    return (
      <DashboardLayout>
        <EventsPage />
      </DashboardLayout>
    );
  }

  return (
    <MainLayout>
      <EventsPage />
    </MainLayout>
  );
};

function App() {
  const { theme } = useSelector((state) => state.ui);
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    document.body.classList.add(...classes);

    return () => {
      document.body.classList.remove(...classes);
    };
  }, []);

  // Update theme class on HTML element for Tailwind CSS dark mode support
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <>
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/books" element={<SearchPage />} />
          <Route path="/book/:id" element={<BookDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPage />} />
          <Route path="/digital-library" element={<DigitalLibraryPage />} />
        </Route>

        <Route path="/events" element={<EventsRoute />} />

        {/* Admin events route with dashboard layout */}
        {isAuthenticated && role === 'admin' || role === 'librarian' && (
          <Route element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/admin/events" element={<EventsPage />} />
          </Route>
        )}

        {/* Auth Routes with AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Private Dashboard & Admin Routes with DashboardLayout */}
        <Route element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/study-desks" element={<StudyDeskPage />} />
          <Route path="/meeting-rooms" element={<MeetingRoomsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/borrowed" element={<BorrowedBooksPage />} />

          {/* Admin specific route */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin', 'librarian']}>
              <AdminPage />
            </ProtectedRoute>
          } />
        </Route>

        {/* Fallback route - Redirect to Home or 404 */}
        <Route path="*" element={<MainLayout />}>
          <Route path="*" element={
            <div className="text-center py-20 space-y-md">
              <h1 className="text-4xl font-headline-h1 font-bold text-ember-orange">404</h1>
              <p className="font-body-lg text-on-surface-variant">Sayfa Bulunamadı.</p>
              <a href="/" className="inline-block px-md py-sm bg-vivid-purple text-white rounded-lg">Ana Sayfaya Dön</a>
            </div>
          } />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
