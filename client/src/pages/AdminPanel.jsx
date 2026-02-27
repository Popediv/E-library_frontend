import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminPanel = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '', author: '', description: '',
    genre: '', price: '', isFree: false
  });
  const [coverFile, setCoverFile] = useState(null);
  const [bookFile, setBookFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editingBook, setEditingBook] = useState(null);
  const [matricNumbers, setMatricNumbers] = useState([]);
  const [matricInput, setMatricInput] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [matricMessage, setMatricMessage] = useState({ text: '', type: '' });
  const [matricLoading, setMatricLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const genres = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'Self Help', 'History', 'Biography'];

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/books');
      setBooks(data);
    } catch (err) {
      console.error('Failed to fetch books:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatricNumbers = async () => {
    try {
      const { data } = await api.get('/matric');
      setMatricNumbers(data);
    } catch (err) {
      console.error(err);
    }
  };



const fetchUsers = async () => {
  try {
    const { data } = await api.get('/auth/users');
    setUsers(data);
  } catch (err) {
    console.error(err);
  }
};

const handleSuspend = async (id) => {
  if (!window.confirm('Suspend this student?')) return;
  try {
    await api.put(`/auth/suspend/${id}`);
    fetchUsers();
  } catch (err) {
    console.error(err);
  }
};

const handleUnsuspend = async (id) => {
  try {
    await api.put(`/auth/unsuspend/${id}`);
    fetchUsers();
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    fetchBooks();
    fetchMatricNumbers();
    fetchUsers();
  }, []);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const uploadFile = async (file, endpoint) => {
    const form = new FormData();
    const key = endpoint === 'cover' ? 'coverImage' : 'bookFile';
    form.append(key, file);
    const { data } = await api.post(`/upload/${endpoint}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.url;
  };

  const resetForm = () => {
    setFormData({ title: '', author: '', description: '', genre: '', price: '', isFree: false });
    setCoverFile(null);
    setBookFile(null);
    setEditingBook(null);
    setMessage({ text: '', type: '' });
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      genre: book.genre,
      price: book.price,
      isFree: book.isFree
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingBook) {
      if (!coverFile) return setMessage({ text: 'Please select a cover image', type: 'error' });
      if (!bookFile) return setMessage({ text: 'Please select a PDF file', type: 'error' });
    }

    setUploading(true);
    setMessage({ text: '', type: '' });

    try {
      let coverImageUrl = editingBook?.coverImage || '';
      let fileUrl = editingBook?.fileUrl || '';

      if (coverFile) coverImageUrl = await uploadFile(coverFile, 'cover');
      if (bookFile) fileUrl = await uploadFile(bookFile, 'book');

      if (editingBook) {
        await api.put(`/books/${editingBook._id}`, {
          ...formData,
          coverImage: coverImageUrl,
          fileUrl,
          price: formData.isFree ? 0 : formData.price
        });
        setMessage({ text: 'Book updated successfully!', type: 'success' });
      } else {
        await api.post('/books', {
          ...formData,
          coverImage: coverImageUrl,
          fileUrl,
          price: formData.isFree ? 0 : formData.price
        });
        setMessage({ text: 'Book added successfully!', type: 'success' });
      }

      resetForm();
      fetchBooks();
    } catch (err) {
      console.error('Submit error:', err);
      setMessage({ text: err.response?.data?.message || 'Something went wrong', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.delete(`/books/${id}`);
      fetchBooks();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleAddMatric = async (e) => {
    e.preventDefault();
    setMatricLoading(true);
    setMatricMessage({ text: '', type: '' });
    try {
      await api.post('/matric/add', { matricNumber: matricInput });
      setMatricMessage({ text: 'Matric number added!', type: 'success' });
      setMatricInput('');
      fetchMatricNumbers();
    } catch (err) {
      setMatricMessage({ text: err.response?.data?.message || 'Something went wrong', type: 'error' });
    } finally {
      setMatricLoading(false);
    }
  };

  const handleCSVUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) return setMatricMessage({ text: 'Please select a CSV file', type: 'error' });
    setMatricLoading(true);
    setMatricMessage({ text: '', type: '' });
    try {
      const form = new FormData();
      form.append('csvFile', csvFile);
      const { data } = await api.post('/matric/upload-csv', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMatricMessage({ text: data.message, type: 'success' });
      setCsvFile(null);
      fetchMatricNumbers();
    } catch (err) {
      setMatricMessage({ text: err.response?.data?.message || 'Something went wrong', type: 'error' });
    } finally {
      setMatricLoading(false);
    }
  };

  const handleDeleteMatric = async (id) => {
    if (!window.confirm('Delete this matric number?')) return;
    try {
      await api.delete(`/matric/${id}`);
      fetchMatricNumbers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 overflow-x-hidden">
      <div className="max-w-5xl mx-auto w-full">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">Admin Panel</h1>
          <Link to="/adminstats" className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition">
            📊 View Stats
          </Link>
        </div>

        {/* Add / Edit Book Form */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-700">
              {editingBook ? '✏️ Edit Book' : '➕ Add New Book'}
            </h2>
            {editingBook && (
              <button onClick={resetForm} className="text-sm text-red-500 hover:underline">
                Cancel Edit
              </button>
            )}
          </div>

          {message.text && (
            <div className={`px-4 py-2 rounded-lg mb-4 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input name="title" value={formData.title} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input name="author" value={formData.author} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
              <select name="genre" value={formData.genre} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select genre</option>
                {genres.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
              <input name="price" type="number" value={formData.price} onChange={handleChange}
                required={!formData.isFree} disabled={formData.isFree}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image {editingBook && <span className="text-xs text-gray-400">(leave empty to keep current)</span>}
              </label>
              <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])}
                className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              {coverFile && <p className="text-xs text-green-600 mt-1">✓ {coverFile.name}</p>}
              {editingBook && !coverFile && (
                <img src={editingBook.coverImage} alt="current cover" className="w-12 h-16 object-cover rounded mt-2" />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Book PDF {editingBook && <span className="text-xs text-gray-400">(leave empty to keep current)</span>}
              </label>
              <input type="file" accept=".pdf" onChange={(e) => setBookFile(e.target.files[0])}
                className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              {bookFile && <p className="text-xs text-green-600 mt-1">✓ {bookFile.name}</p>}
            </div>

            <div className="md:col-span-2 flex items-center gap-2">
              <input type="checkbox" name="isFree" checked={formData.isFree} onChange={handleChange}
                className="w-4 h-4" />
              <label className="text-sm text-gray-700">This book is free</label>
            </div>

            <div className="md:col-span-2">
              <button type="submit" disabled={uploading}
                className="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50">
                {uploading ? 'Saving... Please wait' : editingBook ? 'Update Book' : 'Add Book'}
              </button>
            </div>
          </form>
        </div>

        {/* Books List */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-700 mb-6">Manage Books ({books.length})</h2>
          {loading ? (
            <p className="text-gray-500">Loading books...</p>
          ) : books.length === 0 ? (
            <p className="text-gray-500">No books added yet.</p>
          ) : (
            <div className="space-y-4">
              {books.map((book) => (
                <div key={book._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border border-gray-200 rounded-xl p-4 gap-3">
                  <div className="flex items-center gap-4">
                    <img src={book.coverImage} alt={book.title} className="w-12 h-16 object-cover rounded" />
                    <div>
                      <h3 className="font-bold text-gray-800">{book.title}</h3>
                      <p className="text-sm text-gray-500">{book.author} • {book.genre}</p>
                      <p className="text-sm text-blue-700 font-semibold">
                        {book.isFree ? 'Free' : `₦${book.price.toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-16 sm:ml-0">
                    <button onClick={() => handleEdit(book)}
                      className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition text-sm font-semibold">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(book._id)}
                      className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition text-sm font-semibold">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Matric Number Management */}
        <div className="bg-white rounded-2xl shadow-md p-8 mt-10">
          <h2 className="text-xl font-bold text-gray-700 mb-6">Manage Matric Numbers</h2>

          {matricMessage.text && (
            <div className={`px-4 py-2 rounded-lg mb-4 text-sm ${matricMessage.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {matricMessage.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Add single matric */}
            <div>
              <h3 className="font-semibold text-gray-600 mb-3">Add Single Matric Number</h3>
              <form onSubmit={handleAddMatric} className="flex flex-col gap-2">
                <input
                  type="text"
                  value={matricInput}
                  onChange={(e) => setMatricInput(e.target.value)}
                  placeholder="e.g. CSC/2021/001"
                  required
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" disabled={matricLoading}
                  className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-50">
                  Add
                </button>
              </form>
            </div>

            {/* Upload CSV */}
            <div>
              <h3 className="font-semibold text-gray-600 mb-3">Upload CSV File</h3>
              <form onSubmit={handleCSVUpload} className="flex flex-col gap-2">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
                <button type="submit" disabled={matricLoading}
                  className="w-full bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition disabled:opacity-50">
                  Upload CSV
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-1">CSV should have matric numbers in the first column</p>
            </div>
          </div>
          {/* Students Management */}
          <div className="bg-white rounded-2xl shadow-md p-8 mt-10">
            <h2 className="text-xl font-bold text-gray-700 mb-6">Manage Students ({users.length})</h2>
            <div className="max-h-96 overflow-y-auto overflow-x-auto">
              {users.length === 0 ? (
                <p className="text-gray-500 text-sm">No students registered yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-2 font-semibold text-gray-600">Name</th>
                      <th className="text-left px-4 py-2 font-semibold text-gray-600">Matric No</th>
                      <th className="text-left px-4 py-2 font-semibold text-gray-600">Status</th>
                      <th className="text-left px-4 py-2 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-t border-gray-100">
                        <td className="px-4 py-2">
                          <p className="font-medium text-gray-800">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </td>
                        <td className="px-4 py-2 font-mono text-xs">{u.matricNumber}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.isSuspended ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            {u.isSuspended ? 'Suspended' : 'Active'}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2">
                            {u.isSuspended ? (
                              <button onClick={() => handleUnsuspend(u._id)}
                                className="bg-green-100 text-green-600 px-3 py-1 rounded-lg hover:bg-green-200 transition text-xs font-semibold">
                                Unsuspend
                              </button>
                            ) : (
                              <button onClick={() => handleSuspend(u._id)}
                                className="bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition text-xs font-semibold">
                                Suspend
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          {/* Matric Numbers List */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {matricNumbers.length === 0 ? (
              <p className="text-gray-500 text-sm">No matric numbers added yet.</p>
            ) : (
              matricNumbers.map((m) => (
                <div key={m._id} className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-sm text-gray-800">{m.matricNumber}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${m.isUsed ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {m.isUsed ? 'Used' : 'Available'}
                    </span>
                  </div>
                  <button onClick={() => handleDeleteMatric(m._id)}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition text-xs font-semibold flex-shrink-0 ml-2">
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;