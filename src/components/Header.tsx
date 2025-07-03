
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AuthModal } from './AuthModal';

export const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"></div>
              <span className="text-xl font-bold text-gray-800">NC AI Roadmap Generator</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">Product</a>
              <a href="#" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">Templates</a>
              <a href="#" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">Learn</a>
              <a href="#" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">Pricing</a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <Button
                  onClick={() => setIsLoggedIn(false)}
                  variant="outline"
                  className="px-6 py-2 rounded-xl border-gray-300 hover:border-purple-400 hover:text-purple-600 transition-all duration-300"
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => setIsAuthModalOpen(true)}
                    variant="ghost"
                    className="px-6 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300"
                  >
                    Log in
                  </Button>
                  <Button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Sign up for free
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};
