"use client";

import { usePathname } from 'next/navigation';
import { BiHeart, BiShield, BiEnvelope } from 'react-icons/bi';

export const Footer = () => {
  const pathname = usePathname();

  // Don't show footer on chat page (it will be handled by the chat component)
  if (pathname === '/chat') {
    return null;
  }

  return (
    <footer className="bg-white/90 backdrop-blur-md border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                <BiHeart className="text-sm" />
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ThingTalk
              </h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              A safe, compassionate space for mental health support. Our AI-powered chat provides 
              immediate emotional support while maintaining your privacy and safety.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => alert('Resources feature coming soon!')}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Mental Health Resources
                </button>
              </li>
              <li>
                <button 
                  onClick={() => alert('Safety guidelines coming soon!')}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Safety Guidelines
                </button>
              </li>
              <li>
                <button 
                  onClick={() => alert('Privacy policy coming soon!')}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => alert('Terms of service coming soon!')}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => alert('Help center coming soon!')}
                  className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <BiEnvelope className="text-sm" />
                  Contact Support
                </button>
              </li>
              <li>
                <button 
                  onClick={() => alert('Crisis resources coming soon!')}
                  className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <BiShield className="text-sm" />
                  Crisis Resources
                </button>
              </li>
              <li>
                <button 
                  onClick={() => alert('FAQ coming soon!')}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © 2024 ThingTalk. This is not a substitute for professional mental health care. 
            If you're in crisis, please contact emergency services or a crisis hotline.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Made with ❤️ for mental health</span>
          </div>
        </div>
      </div>
    </footer>
  );
}; 