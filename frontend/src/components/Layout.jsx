import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinkClass = (path) => 
    `text-lg font-medium transition-colors duration-200 py-2 md:py-0 md:h-full flex items-center md:border-b-2 ${
      location.pathname === path 
      ? 'text-brand md:border-brand' 
      : 'text-gray-500 hover:text-gray-900 md:border-transparent'
    }`;

  return (
    <div className="min-h-screen bg-boardBg font-sans text-gray-900">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-brand font-bold text-2xl tracking-tight">
            <span className="text-3xl"></span> VolunTrack
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 h-full">
            <Link to="/" className={navLinkClass('/')}>Dashboard</Link>
            <Link to="/opportunities" className={navLinkClass('/opportunities')}>Opportunities</Link>
            <Link to="/add" className="bg-brand text-white text-lg font-medium px-6 py-2.5 rounded-lg hover:bg-brandHover transition-colors ml-4 shadow-sm">
              + Add Opportunity
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-3 text-gray-600 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 px-6 py-6 flex flex-col gap-6 shadow-lg">
            <Link to="/" onClick={() => setMenuOpen(false)} className={navLinkClass('/')}>Dashboard</Link>
            <Link to="/opportunities" onClick={() => setMenuOpen(false)} className={navLinkClass('/opportunities')}>Opportunities</Link>
            <Link to="/add" onClick={() => setMenuOpen(false)} className="bg-brand text-white text-center text-lg font-medium px-6 py-3 rounded-lg mt-2">
              + Add Opportunity
            </Link>
          </div>
        )}
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>
    </div>
  );
};

export default Layout;