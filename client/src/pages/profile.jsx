import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, login } = useAuth();
  const [nameData, setNameData] = useState({ name: user?.name || '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [nameMessage, setNameMessage] = useState({ text: '', type: '' });
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });
  const [nameLoading, setNameLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleNameUpdate = async (e) => {
    e.preventDefault();
    setNameLoading(true);
    setNameMessage({ text: '', type: '' });
    try {
      const { data } = await api.put('/auth/update-profile', { name: nameData.name });
      login({ ...user, name: data.name });
      setNameMessage({ text: 'Name updated successfully!', type: 'success' });
    } catch (err) {
      setNameMessage({ text: err.response?.data?.message || 'Something went wrong', type: 'error' });
    } finally {
      setNameLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setPasswordMessage({ text: 'Passwords do not match', type: 'error' });
    }
    setPasswordLoading(true);
    setPasswordMessage({ text: '', type: '' });
    try {
      await api.put('/auth/update-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordMessage({ text: 'Password updated successfully!', type: 'success' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordMessage({ text: err.response?.data?.message || 'Something went wrong', type: 'error' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-8">My Profile</h1>

        {/* Profile Info */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${user?.role === 'admin' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Update Name */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Update Name</h2>

          {nameMessage.text && (
            <div className={`px-4 py-2 rounded-lg mb-4 text-sm ${nameMessage.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {nameMessage.text}
            </div>
          )}

          <form onSubmit={handleNameUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={nameData.name}
                onChange={(e) => setNameData({ name: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" disabled={nameLoading}
              className="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50">
              {nameLoading ? 'Updating...' : 'Update Name'}
            </button>
          </form>
        </div>

        {/* Update Password */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Change Password</h2>

          {passwordMessage.text && (
            <div className={`px-4 py-2 rounded-lg mb-4 text-sm ${passwordMessage.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {passwordMessage.text}
            </div>
          )}

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" disabled={passwordLoading}
              className="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50">
              {passwordLoading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;