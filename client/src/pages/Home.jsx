import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-blue-700 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to E-Library</h1>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Access thousands of books anytime, anywhere. Your knowledge hub is just a click away.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/books"
            className="bg-white text-blue-700 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition"
          >
            Browse Books
          </Link>
          {!user && (
            <Link
              to="/register"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 transition"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why E-Library?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-2xl bg-blue-50">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-blue-700 mb-2">Wide Collection</h3>
            <p className="text-gray-500">Access a wide range of books across multiple genres and subjects.</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-blue-50">
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="text-xl font-bold text-blue-700 mb-2">Read Anywhere</h3>
            <p className="text-gray-500">Access your books from any device, anytime and anywhere you are.</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-blue-50">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-blue-700 mb-2">Secure Access</h3>
            <p className="text-gray-500">Your account and reading data are safe and secure with us.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to start reading?</h2>
        <p className="text-gray-500 mb-8">Join our growing community of readers today.</p>
        {user ? (
          <Link
            to="/books"
            className="bg-blue-700 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-800 transition"
          >
            Go to Library
          </Link>
        ) : (
          <Link
            to="/register"
            className="bg-blue-700 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-800 transition"
          >
            Create Free Account
          </Link>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-blue-700 text-white text-center py-6">
        <p className="text-blue-200 text-sm">© 2025 E-Library. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;