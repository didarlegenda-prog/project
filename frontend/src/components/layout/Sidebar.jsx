import { Link } from 'react-router-dom';
import { X, Home, ShoppingCart, Calendar, User, Bell, Settings, HelpCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const { isAuthenticated, user } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/', public: true },
    { icon: ShoppingCart, label: 'Cart', path: '/cart', public: false },
    { icon: ShoppingCart, label: 'Orders', path: '/orders', public: false },
    { icon: Calendar, label: 'Reservations', path: '/reservations', public: false },
    { icon: User, label: 'Profile', path: '/profile', public: false },
    { icon: Settings, label: 'Addresses', path: '/addresses', public: false },
    { icon: Bell, label: 'Notifications', path: '/notifications', public: false },
    { icon: HelpCircle, label: 'Support', path: '/support', public: false },
  ];

  const filteredMenuItems = isAuthenticated 
    ? menuItems 
    : menuItems.filter(item => item.public);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="text-xl font-bold text-primary">FoodApp</span>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4">
          {isAuthenticated && user && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="font-semibold text-gray-900">
                {user.first_name || user.username}
              </p>
            </div>
          )}

          <nav className="space-y-1">
            {filteredMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {!isAuthenticated && (
            <div className="mt-6 space-y-2">
              <Link
                to="/login"
                onClick={onClose}
                className="block w-full px-4 py-2 text-center text-white bg-primary rounded-lg hover:bg-primary-600"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="block w-full px-4 py-2 text-center text-primary border-2 border-primary rounded-lg hover:bg-primary-50"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
