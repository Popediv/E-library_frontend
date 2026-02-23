import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../services/api';

const COLORS = ['#1d4ed8', '#16a34a', '#dc2626', '#d97706', '#7c3aed', '#0891b2', '#be185d'];

const AdminStats = () => {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: booksData } = await api.get('/books');
        setBooks(booksData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Genre distribution data for pie chart
  const genreData = books.reduce((acc, book) => {
    const existing = acc.find(item => item.name === book.genre);
    if (existing) existing.value += 1;
    else acc.push({ name: book.genre, value: 1 });
    return acc;
  }, []);

  // Free vs Paid data for bar chart
  const freeVsPaid = [
    { name: 'Free Books', count: books.filter(b => b.isFree).length },
    { name: 'Paid Books', count: books.filter(b => !b.isFree).length }
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      Loading stats...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">Admin Stats</h1>
          <Link to="/admin" className="text-blue-700 hover:underline text-sm">
            ← Back to Admin Panel
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-4xl font-bold text-blue-700">{books.length}</p>
            <p className="text-gray-500 text-sm mt-1">Total Books</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-4xl font-bold text-green-600">{books.filter(b => b.isFree).length}</p>
            <p className="text-gray-500 text-sm mt-1">Free Books</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-4xl font-bold text-purple-600">{books.filter(b => !b.isFree).length}</p>
            <p className="text-gray-500 text-sm mt-1">Paid Books</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-4xl font-bold text-orange-500">{genreData.length}</p>
            <p className="text-gray-500 text-sm mt-1">Genres</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart - Free vs Paid */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Free vs Paid Books</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={freeVsPaid}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - Genre Distribution */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Books by Genre</h2>
            {genreData.length === 0 ? (
              <p className="text-gray-500 text-sm">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value})`}
                  >
                    {genreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Books per Genre Bar Chart */}
          <div className="bg-white rounded-2xl shadow p-6 md:col-span-2">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Books per Genre</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={genreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {genreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;