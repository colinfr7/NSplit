
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Button from './Button';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Settings, LayoutDashboard, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, signOut } = useAuth();
  
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
          {!isAuthenticated ? (
            // Not logged in state
            <>
              <Link to="/create-event" className="text-sm font-medium text-gray-700 hover:text-nsplit-600 transition-colors">
                Add Event
              </Link>
              <Link to="/add-payment" className="text-sm font-medium text-gray-700 hover:text-nsplit-600 transition-colors">
                Add Payment
              </Link>
              <div className="ml-4 flex space-x-3">
                <Link to="/sign-in">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link to="/sign-up">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            </>
          ) : (
            // Logged in state
            <>
              <Link to="/create-event" className="text-sm font-medium text-gray-700 hover:text-nsplit-600 transition-colors">
                Add Event
              </Link>
              <Link to="/add-payment" className="text-sm font-medium text-gray-700 hover:text-nsplit-600 transition-colors">
                Add Payment
              </Link>
              <Link 
                to="/dashboard" 
                className={`text-sm font-medium ${
                  location.pathname === '/dashboard' 
                    ? 'text-nsplit-600 font-semibold' 
                    : 'text-gray-700 hover:text-nsplit-600'
                } transition-colors`}
              >
                Dashboard
              </Link>
              <div className="ml-4 flex items-center space-x-3">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none">
                    <div className="w-8 h-8 rounded-full bg-nsplit-100 flex items-center justify-center text-nsplit-700">
                      <span className="text-sm font-medium">{user?.displayName?.charAt(0) || 'U'}</span>
                    </div>
                    <ChevronDown size={16} className="text-gray-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => window.location.href = '/dashboard'}>
                      <LayoutDashboard size={16} className="mr-2" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
                      <Settings size={16} className="mr-2" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut size={16} className="mr-2" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
            {!isAuthenticated ? (
              // Not logged in state - mobile
              <>
                <Link 
                  to="/create-event" 
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-nsplit-50 transition-colors"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Add Event
                </Link>
                <Link 
                  to="/add-payment" 
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-nsplit-50 transition-colors"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Add Payment
                </Link>
                <div className="pt-2 flex flex-col space-y-3 px-4">
                  <Link to="/sign-in" onClick={() => setIsMobileNavOpen(false)}>
                    <Button variant="outline" fullWidth>Sign In</Button>
                  </Link>
                  <Link to="/sign-up" onClick={() => setIsMobileNavOpen(false)}>
                    <Button fullWidth>Sign Up</Button>
                  </Link>
                </div>
              </>
            ) : (
              // Logged in state - mobile
              <>
                <Link 
                  to="/create-event" 
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-nsplit-50 transition-colors"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Add Event
                </Link>
                <Link 
                  to="/add-payment" 
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-nsplit-50 transition-colors"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Add Payment
                </Link>
                <Link 
                  to="/dashboard" 
                  className={`block px-4 py-2 rounded-md ${
                    location.pathname === '/dashboard' 
                      ? 'bg-nsplit-50 text-nsplit-600 font-medium' 
                      : 'text-gray-700 hover:bg-nsplit-50'
                  } transition-colors`}
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/settings" 
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-nsplit-50 transition-colors"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Settings
                </Link>
                <button 
                  onClick={() => {
                    signOut();
                    setIsMobileNavOpen(false);
                  }}
                  className="flex items-center px-4 py-2 rounded-md text-gray-700 hover:bg-nsplit-50 transition-colors"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
