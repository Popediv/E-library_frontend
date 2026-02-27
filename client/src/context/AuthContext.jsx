import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const userRef = useRef(user);
  const INACTIVE_TIMEOUT = 10 * 60 * 1000; // 10 minutes

  // Keep userRef in sync with user state
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    navigate('/login');
  }, [navigate]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      logout();
      alert('You have been logged out due to inactivity.');
    }, INACTIVE_TIMEOUT);
  }, [logout]);

  // Polling — runs once on mount, uses userRef to always get latest token
  useEffect(() => {
    console.log('Polling started');

    const checkUserStatus = async () => {
      const currentUser = userRef.current;
      if (!currentUser) return;

      console.log('Checking user status...');
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/me`,
          { headers: { Authorization: `Bearer ${currentUser.token}` } }
        );
        console.log('User status OK:', response.data.name);

        // Update user data
        const updatedUser = { ...currentUser, ...response.data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (err) {
        console.log('Poll error:', err.response?.status, err.response?.data?.message);
        const status = err.response?.status;
        const message = err.response?.data?.message;

        if (status === 403 && message?.includes('suspended')) {
          logout();
          alert('Your account has been suspended. Contact the library admin.');
        } else if (status === 403 && message?.includes('revoked')) {
          logout();
          alert('Your access has been revoked. Contact the library admin.');
        } else if (status === 401) {
          logout();
        }
      }
    };

    const interval = setInterval(checkUserStatus, 60 * 1000); // every 1 minute
    return () => clearInterval(interval);
  }, []); // empty deps — runs once on mount only

  // Listen for user activity
  useEffect(() => {
    if (!user) return;

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [user, resetTimer]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);