import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { NotepadText, User, LogOut } from 'lucide-react';

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // Add this to detect route changes

  useEffect(() => {
    // Check authentication status whenever route changes or component mounts
    checkAuthStatus();
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    // Listen for storage events (in case token is changed in another tab)
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, [location.pathname]); // Re-run when route changes

  // Separate function to check auth status
  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-surface-dark border-b border-accent-coral-200 dark:border-accent-purple-300 px-6 py-4 shadow-soft">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center gap-2">
      <NotepadText size={24} className="text-primary-coral dark:text-primary-purple" />
      <span className="font-bold text-lg">Visual Notes</span>
    </div>

        <div className="flex items-center space-x-6">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/notes" className="nav-link">Notes</Link>
              <Link to="/editor" className="nav-link">Create</Link>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 text-text-primary dark:text-text-light hover:text-primary-coral dark:hover:text-primary-purple transition-colors duration-200"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn-primary">Login / Register</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;