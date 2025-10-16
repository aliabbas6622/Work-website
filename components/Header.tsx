import React from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  const linkClasses = 'text-gray-500 hover:text-[var(--accent-color)] transition-colors font-medium';
  const activeLinkClasses = 'text-[var(--accent-color)]';

  return (
    <header className="sticky top-0 z-40 bg-transparent animate-fade-in-up">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
        <NavLink to="/" className="flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4Z" fill="url(#paint0_linear_1_2)"/>
            <path d="M24 14L34 24L24 34L14 24L24 14Z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
            <linearGradient id="paint0_linear_1_2" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A78BFA"/>
            <stop offset="1" stopColor="#3B82F6"/>
            </linearGradient>
            </defs>
          </svg>
          <div>
            <h1 className="text-lg font-bold text-gray-800 tracking-wide">ETHEREALEX</h1>
            <p className="text-xs text-gray-500">Weaving Worlds from Words</p>
          </div>
        </NavLink>
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Home</NavLink>
          <NavLink to="/archive" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Archive</NavLink>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-gray-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;