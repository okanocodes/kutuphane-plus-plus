import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import BookDetailPage from './pages/BookDetailPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import Footer from './components/Footer'
import NavBar from './components/Navbar'
import { useEffect } from 'react';


function App() {

  const classes = ['bg-surface', 'text-on-surface', 'font-body-md', 'overflow-x-hidden'];


  useEffect(() => {
    document.body.classList.add(...classes);

    return () => {
      document.body.classList.remove(...classes);
    };
  }, []);


  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/book/:id" element={<BookDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
