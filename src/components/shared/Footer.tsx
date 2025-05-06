import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Mail, Phone, HelpCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <CreditCard size={24} className="mr-2" />
              <h3 className="text-xl font-bold">Azure Card Portal</h3>
            </div>
            <p className="text-blue-200 text-sm">
              A secure portal for managing your credit card accounts and payments.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-blue-200 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/cards" className="text-blue-200 hover:text-white transition-colors">
                  Card Management
                </Link>
              </li>
              <li>
                <Link to="/payment" className="text-blue-200 hover:text-white transition-colors">
                  Make a Payment
                </Link>
              </li>
              <li>
                <Link to="/rewards" className="text-blue-200 hover:text-white transition-colors">
                  Rewards
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-blue-200 hover:text-white transition-colors flex items-center">
                  <HelpCircle size={16} className="mr-2" />
                  FAQs
                </Link>
              </li>
              <li>
                <a href="tel:+18001234567" className="text-blue-200 hover:text-white transition-colors flex items-center">
                  <Phone size={16} className="mr-2" />
                  1-800-123-4567
                </a>
              </li>
              <li>
                <a href="mailto:support@azurecard.com" className="text-blue-200 hover:text-white transition-colors flex items-center">
                  <Mail size={16} className="mr-2" />
                  support@azurecard.com
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-blue-200 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-blue-200 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-blue-200 hover:text-white transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-blue-800">
          <p className="text-center text-blue-200 text-sm">
            &copy; {new Date().getFullYear()} Azure Card Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;