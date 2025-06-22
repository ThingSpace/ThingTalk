"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@components/ui/Button';
import { 
  BiBrain, 
  BiMenu, 
  BiX, 
  BiUser, 
  BiCog, 
  BiHelpCircle, 
  BiBookOpen,
  BiShield,
  BiHeart
} from 'react-icons/bi';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Determine current page based on pathname
  const getCurrentPage = () => {
    if (pathname === '/chat') return 'chat';
    if (pathname === '/resources') return 'resources';
    if (pathname === '/safety') return 'safety';
    if (pathname === '/help') return 'help';
    if (pathname === '/profile') return 'profile';
    if (pathname === '/settings') return 'settings';
    return 'chat'; // Default to chat
  };

  const currentPage = getCurrentPage();

  const navigationItems = [
    { id: 'chat', label: 'Chat', icon: BiBrain, href: '/chat' },
    { id: 'resources', label: 'Resources', icon: BiBookOpen, href: '/resources' },
    { id: 'safety', label: 'Safety', icon: BiShield, href: '/safety' },
    { id: 'help', label: 'Help', icon: BiHelpCircle, href: '/help' },
  ];

  const userMenuItems = [
    { id: 'profile', label: 'Profile', icon: BiUser, href: '/profile' },
    { id: 'settings', label: 'Settings', icon: BiCog, href: '/settings' },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
              <BiHeart className="text-xl" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ThingTalk
              </h1>
              <p className="text-xs text-gray-500">Mental Health Support</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  styles={currentPage === item.id ? 'exotic' : 'default'}
                  width="fit"
                  onClick={() => {
                    // For now, just show an alert. In the future, this would navigate
                    if (item.id !== 'chat') {
                      alert(`${item.label} feature coming soon!`);
                    }
                  }}
                  className={`flex items-center gap-2 ${
                    currentPage === item.id 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="text-lg" />
                  <span>{item.label}</span>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                styles="default"
                width="fit"
                onClick={() => alert('Profile feature coming soon!')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <BiUser className="text-lg" />
                <span>Account</span>
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                styles="default"
                width="fit"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2"
              >
                {isMenuOpen ? (
                  <BiX className="text-xl" />
                ) : (
                  <BiMenu className="text-xl" />
                )}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-200 bg-white"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigationItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      styles={currentPage === item.id ? 'exotic' : 'default'}
                      width="full"
                      onClick={() => {
                        setIsMenuOpen(false);
                        if (item.id !== 'chat') {
                          alert(`${item.label} feature coming soon!`);
                        }
                      }}
                      className={`justify-start ${
                        currentPage === item.id 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="text-lg" />
                      <span>{item.label}</span>
                    </Button>
                  </motion.div>
                ))}
                
                <div className="border-t border-gray-200 pt-2 mt-2">
                  {userMenuItems.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        styles="default"
                        width="full"
                        onClick={() => {
                          setIsMenuOpen(false);
                          alert(`${item.label} feature coming soon!`);
                        }}
                        className="justify-start text-gray-600 hover:text-gray-900"
                      >
                        <item.icon className="text-lg" />
                        <span>{item.label}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}; 