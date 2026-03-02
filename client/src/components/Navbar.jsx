import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav className={`${darkMode ? 'bg-slate-900 text-white border-b border-slate-700' : 'bg-blue-700 text-white'} px-6 py-4 shadow-md transition-colors duration-300`}>
      <div className="flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          📚 E-Library
        </Link>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-blue-600 hover:bg-blue-500'}`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Hamburger - mobile only */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/books" className="hover:text-blue-200 transition">Books</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-200 transition">Dashboard</Link>
                <Link to="/profile" className="hover:text-blue-200 transition">Profile</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:text-blue-200 transition">Admin</Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-white text-blue-700 px-4 py-1.5 rounded-full font-semibold hover:bg-blue-100 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition">Login</Link>
                <Link to="/register" className="bg-white text-blue-700 px-4 py-1.5 rounded-full font-semibold hover:bg-blue-100 transition">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={`md:hidden mt-4 flex flex-col gap-4 border-t pt-4 ${darkMode ? 'border-slate-700' : 'border-blue-600'}`}>
          <Link to="/books" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 transition">Books</Link>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 transition">Dashboard</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 transition">Profile</Link>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 transition">Admin</Link>
              )}
              <button onClick={handleLogout} className="bg-white text-blue-700 px-4 py-2 rounded-full font-semibold hover:bg-blue-100 transition text-left w-full">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 transition">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 transition">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;