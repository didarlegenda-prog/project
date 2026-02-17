import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              About FoodApp
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your favorite food delivery service. Order from the best restaurants in your area.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                ['/', 'Home'],
                ['/orders', 'Orders'],
                ['/reservations', 'Reservations'],
                ['/support', 'Support'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Account
            </h3>
            <ul className="space-y-2">
              {[
                ['/profile', 'Profile'],
                ['/addresses', 'Addresses'],
                ['/notifications', 'Notifications'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start text-sm text-gray-400">
                <Mail className="h-5 w-5 mr-2 text-gray-500" />
                support@foodapp.com
              </li>
              <li className="flex items-start text-sm text-gray-400">
                <Phone className="h-5 w-5 mr-2 text-gray-500" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-start text-sm text-gray-400">
                <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                123 Food Street, NYC, 10001
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} FoodApp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
