import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');

  const genres = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'Self Help', 'History', 'Biography'];

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (genre) params.genre = genre;
      const { data } = await api.get('/books', { params });
      setBooks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchBooks();
    }, 500);
    return () => clearTimeout(delay);
  }, [genre, search]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Browse Books</h1>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading books...</div>
        ) : books.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No books found.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <Link
                to={`/books/${book._id}`}
                key={book._id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 text-sm line-clamp-2">{book.title}</h3>
                  <p className="text-gray-500 text-xs mt-1">{book.author}</p>
                  <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {book.genre}
                  </span>
                  <p className="text-blue-700 font-bold mt-2 text-sm">
                    {book.isFree ? 'Free' : `₦${book.price.toLocaleString()}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;