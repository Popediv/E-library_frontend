import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, free: 0, paid: 0 });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await api.get('/books');
        setBooks(data.slice(0, 4)); // show latest 4 books
        setStats({
          total: data.length,
          free: data.filter(b => b.isFree).length,
          paid: data.filter(b => !b.isFree).length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Welcome Banner */}
        <div className="bg-blue-700 text-white rounded-2xl p-8 mb-6">
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}! 👋</h1>
          <p className="text-blue-100 mt-1">Ready to read something great today?</p>
          <Link
            to="/books"
            className="inline-block mt-4 bg-white text-blue-700 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition"
          >
            Browse Library
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-4xl font-bold text-blue-700">{stats.total}</p>
            <p className="text-gray-500 text-sm mt-1">Total Books</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-4xl font-bold text-green-600">{stats.free}</p>
            <p className="text-gray-500 text-sm mt-1">Free Books</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-4xl font-bold text-purple-600">{stats.paid}</p>
            <p className="text-gray-500 text-sm mt-1">Paid Books</p>
          </div>
        </div>

        {/* Profile & Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-700 mb-4">My Profile</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Name:</span> {user?.name}</p>
              <p><span className="font-medium">Email:</span> {user?.email}</p>
              <p><span className="font-medium">Role:</span> 
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${user?.role === 'admin' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {user?.role}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Quick Links</h2>
            <div className="space-y-3">
              <Link to="/books" className="flex items-center gap-3 text-blue-700 hover:underline text-sm">
                📚 Browse all books
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="flex items-center gap-3 text-green-700 hover:underline text-sm">
                  ⚙️ Go to Admin Panel
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Latest Books */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-700">Latest Books</h2>
            <Link to="/books" className="text-blue-700 text-sm hover:underline">View all</Link>
          </div>
          {loading ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : books.length === 0 ? (
            <p className="text-gray-500 text-sm">No books available yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {books.map((book) => (
                <Link to={`/books/${book._id}`} key={book._id} className="hover:opacity-80 transition">
                  <img src={book.coverImage} alt={book.title} className="w-full h-36 object-cover rounded-lg mb-2" />
                  <p className="text-sm font-semibold text-gray-800 line-clamp-1">{book.title}</p>
                  <p className="text-xs text-gray-500">{book.author}</p>
                  <p className="text-xs text-blue-700 font-bold mt-1">
                    {book.isFree ? 'Free' : `₦${book.price.toLocaleString()}`}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;