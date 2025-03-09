
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Button from './Button';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const location = useLocation();
  
  // Check if user is on a page that should show the full header
  const showFullHeader = location.pathname === '/';
  
  // Handle scroll for sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out backdrop-blur-md py-4',
        isScrolled ? 'bg-white/80 shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="container-content flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-nsplit-700 to-nsplit-500 bg-clip-text text-transparent">
            NSplit
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {showFullHeader ? (
            <>
              <a href="#features" className="text-sm font-medium text-gray-700 hover:text-nsplit-600 transition-colors">
                Features
              </a>
              <a href="#howitworks" className="text-sm font-medium text-gray-700 hover:text-nsplit-600 transition-colors">
                How It Works
              </a>
              <a href="#about" className="text-sm font-medium text-gray-700 hover:text-nsplit-600 transition-colors">
                About
              </a>
              <div className="ml-4 flex space-x-3">
                <Link to="/dashboard">
                  <Button variant="outline" size="sm">Dashboard</Button>
                </Link>
                <Button size="sm">Sign Up</Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-gray-700 hover:text-nsplit-600 transition-colors">
                Dashboard
              </Link>
              <Link to="/create-event" className="text-sm font-medium text-gray-700 hover:text-nsplit-600 transition-colors">
                Create Event
              </Link>
              <div className="ml-4 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-nsplit-100 flex items-center justify-center text-nsplit-700">
                  <span className="text-sm font-medium">U</span>
                </div>
              </div>
            </>
          )}
        </nav>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden rounded-md p-2 text-gray-700 hover:bg-nsplit-50 focus:outline-none"
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
        >
          <span className="sr-only">Open menu</span>
          <svg 
            className="h-6 w-6" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isMobileNavOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileNavOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg animate-fade-in">
          <div className="container-content py-4 space-y-4">
            {showFullHeader ? (
              <>
                <a 
                  href="#features" 
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-nsplit-50 transition-colors"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#howitworks" 
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-nsplit-50 transition-colors"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  How It Works
                </a>
                <a 
                  href="#about" 
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-nsplit-50 transition-colors"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  About
                </a>
                <div className="pt-2 flex flex-col space-y-3 px-4">
                  <Link to="/dashboard" onClick={() => setIsMobileNavOpen(false)}>
                    <Button variant="outline" fullWidth>Dashboard</Button>
                  </Link>
                  <Button fullWidth>Sign Up</Button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/dashboard" 
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-nsplit-50 transition-colors"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/create-event" 
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-nsplit-50 transition-colors"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Create Event
                </Link>
                <div className="flex items-center px-4 py-2">
                  <div className="w-8 h-8 rounded-full bg-nsplit-100 flex items-center justify-center text-nsplit-700 mr-3">
                    <span className="text-sm font-medium">U</span>
                  </div>
                  <span className="text-sm font-medium">User Account</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
