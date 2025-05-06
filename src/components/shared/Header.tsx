import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, CreditCard, User as UserIcon, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const menuItems = isAdmin
    ? [
        { name: 'Dashboard', path: '/admin' },
        { name: 'Manage Users', path: '/admin/users' },
        { name: 'Portal Notices', path: '/admin/notices' },
        { name: 'Credit Decisions', path: '/admin/decisions' },
        { name: 'Fees Management', path: '/admin/fees' },
      ]
    : [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Transactions', path: '/transactions' },
        { name: 'Payment', path: '/payment' },
        { name: 'Cards', path: '/cards' },
        { name: 'Rewards', path: '/rewards' },
        { name: 'Statements', path: '/statements' },
      ];

  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <CreditCard size={28} className="mr-2" />
              <span className="font-bold text-xl">Azure Card Portal</span>
            </div>
            
            {/* Desktop menu */}
            <nav className="hidden md:ml-6 md:flex md:space-x-4 items-center">
              {currentUser &&
                menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center">
            {currentUser ? (
              <div className="flex items-center ml-4 space-x-4">
                <Bell size={20} className="cursor-pointer hover:text-blue-300 transition-colors" />
                <div className="relative group">
                  <button className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center">
                      <UserIcon size={18} />
                    </div>
                  </button>
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 hidden group-hover:block">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                      <p className="font-medium text-gray-900">{currentUser.name}</p>
                      <p className="truncate">{currentUser.email}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {currentUser &&
              menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
          </div>
          {currentUser && (
            <div className="pt-4 pb-3 border-t border-blue-800">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center">
                    <UserIcon size={22} />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium">{currentUser.name}</div>
                  <div className="text-sm font-medium text-blue-300">{currentUser.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Your Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;