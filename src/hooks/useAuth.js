import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return {
    user,
    isAuthenticated,
    role: user?.role || null,
    isAdmin: user?.role === 'admin',
    isLibrarian: user?.role === 'librarian',
    isStudent: user?.role === 'student',
    isAcademic: user?.role === 'academic',
  };
};

export default useAuth;
