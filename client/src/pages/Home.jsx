import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import slide1 from '../assets/1.jpg';
import slide2 from '../assets/2.jpg';
import slide3 from '../assets/3.jpg';
import slide4 from '../assets/4.jpg';
import slide5 from '../assets/5.jpg';

const slides = [slide1, slide2, slide3, slide4, slide5];

const Home = () => {
  const { darkMode } = useTheme();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50'}`}>

      {/* Hero Section with Slideshow */}
      <div style={{ position: 'relative', height: '90vh', overflow: 'hidden' }}>

        {/* Slide Images */}
        {slides.map((slide, i) => (
          <img
            key={i}
            src={slide}
            alt={`slide-${i}`}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: i === current ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: 0
            }}
          />
        ))}

        {/* Dark overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 1
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2 }}
          className="h-full flex flex-col items-center justify-center text-white text-center px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Your Digital Library,<br />
            <span className="text-yellow-300">Anytime. Anywhere.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow">
            Access thousands of books, journals and study materials from the comfort of your device.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/books"
              className="bg-white text-blue-700 px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-300 hover:text-blue-900 transition-all duration-300 shadow-lg"
            >
              Browse Library
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-blue-700 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>

          {/* Slide indicators */}
          <div className="flex gap-2 mt-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: i === current ? '24px' : '12px',
                  height: '12px',
                  borderRadius: '9999px',
                  backgroundColor: i === current ? '#fde047' : 'rgba(255,255,255,0.5)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className={`py-12 px-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-blue-700">500+</p>
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Books Available</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-purple-600">24/7</p>
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Access Anytime</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-green-600">100%</p>
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Free to Students</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={`py-16 px-6 ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-5xl mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Why Use Our Library?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '📱', title: 'Read Anywhere', desc: 'Access your books from any device — phone, tablet or computer.' },
              { icon: '🔒', title: 'Secure Access', desc: 'Only registered students with valid matric numbers can access.' },
              { icon: '⚡', title: 'Instant Access', desc: 'No waiting. Search, find and read your book instantly.' },
              { icon: '📂', title: 'All Genres', desc: 'From Science to Fiction — we have books for every interest.' },
              { icon: '🆓', title: 'Free Resources', desc: 'Most books are completely free for enrolled students.' },
              { icon: '🎓', title: 'Academic Focus', desc: 'Curated content specifically for academic excellence.' },
            ].map((feature, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${darkMode ? 'bg-slate-800 text-white' : 'bg-white'}`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ position: 'relative', padding: '64px 24px', textAlign: 'center', overflow: 'hidden' }}>
        <img
          src={slide1}
          alt="cta"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(30, 58, 138, 0.85)',
          zIndex: 1
        }} />
        <div style={{ position: 'relative', zIndex: 2 }} className="max-w-2xl mx-auto text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Reading?</h2>
          <p className="text-blue-100 mb-8">Join thousands of students already using the library.</p>
          <Link
            to="/register"
            className="bg-yellow-300 text-blue-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-400 transition-all duration-300 shadow-lg"
          >
            Register Now — It's Free!
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className={`py-6 px-6 text-center text-sm ${darkMode ? 'bg-slate-900 text-slate-500' : 'bg-gray-800 text-gray-400'}`}>
        <p>© 2024 E-Library. Built for students, by developers who care.</p>
      </footer>

    </div>
  );
};

export default Home;