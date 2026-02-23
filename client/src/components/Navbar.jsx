import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between shadow-md">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold tracking-wide">
        📚 E-Library
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-6">
        <Link to="/books" className="hover:text-blue-200 transition">Books</Link>

        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-blue-200 transition">Dashboard</Link>
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
          <Link to="/login" className="hover:text-blue-200 transition">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;