import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900 text-white">
      <header className="bg-black bg-opacity-40 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Lucid Dreams
            </span>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-blue-400 transition">Dream Journal</a>
            <a href="#" className="hover:text-blue-400 transition">Practice</a>
            <a href="#" className="hover:text-blue-400 transition">Progress</a>
            <a href="#" className="hover:text-blue-400 transition">Resources</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition">
              Login
            </button>
          </div>
        </div>
      </header>
      
      <main>
        {children}
      </main>
      
      <footer className="bg-black bg-opacity-40 backdrop-blur-sm border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">© 2025 Lucid Dreams Application</p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">Terms</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
