import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const BookDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/books/${id}`);
        setBook(data);

        // Fetch related books by same genre
        const { data: allBooks } = await api.get('/books', { params: { genre: data.genre } });
        setRelatedBooks(allBooks.filter(b => b._id !== id).slice(0, 4));
      } catch (err) {
        console.error(err);
        navigate('/books');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      Loading book...
    </div>
  );

  if (!book) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Cover Image */}
          <div className="md:w-1/3">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Book Info */}
          <div className="md:w-2/3 p-8">
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {book.genre}
            </span>
            <h1 className="text-3xl font-bold text-gray-800 mt-3">{book.title}</h1>
            <p className="text-gray-500 mt-1">by {book.author}</p>
            <p className="text-gray-600 mt-4 leading-relaxed">{book.description}</p>

            <div className="mt-6">
              <p className="text-2xl font-bold text-blue-700">
                {book.isFree ? 'Free' : `₦${book.price.toLocaleString()}`}
              </p>
            </div>

            {/* Read Button */}
            <div className="mt-6">
              {user ? (
                <a
                  href={book.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
                >
                  📖 Read Book
                </a>
              ) : (
                <div>
                  <p className="text-red-500 text-sm mb-3">You must be logged in to read this book.</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
                  >
                    Login to Read
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="max-w-4xl mx-auto mt-4">
        <button
          onClick={() => navigate('/books')}
          className="text-blue-700 hover:underline text-sm"
        >
          ← Back to Books
        </button>
      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <div className="max-w-4xl mx-auto mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Related Books</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedBooks.map((related) => (
              <Link
                to={`/books/${related._id}`}
                key={related._id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={related.coverImage}
                  alt={related.title}
                  className="w-full h-36 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-bold text-gray-800 text-xs line-clamp-2">{related.title}</h3>
                  <p className="text-gray-500 text-xs mt-1">{related.author}</p>
                  <p className="text-blue-700 font-bold text-xs mt-1">
                    {related.isFree ? 'Free' : `₦${related.price.toLocaleString()}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;