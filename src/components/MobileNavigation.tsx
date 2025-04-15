'use client'

import React from 'react'
import { useDreamContext } from '@/lib/dream-context'

interface MobileNavigationProps {
  className?: string
}

export default function MobileNavigation({ className = '' }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  
  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={`md:hidden ${className}`}>
      <button 
        onClick={toggleMenu}
        className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
      >
        <span className="sr-only">Menu</span>
        <div className="w-6 h-6 flex flex-col justify-around">
          <span className={`block w-full h-0.5 bg-white transform transition duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-full h-0.5 bg-white transition duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-full h-0.5 bg-white transform transition duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-black bg-opacity-90 backdrop-blur-md z-20 shadow-lg">
          <nav className="p-4">
            <ul className="space-y-4">
              <li>
                <a 
                  href="/" 
                  className="block py-2 px-4 text-white hover:bg-blue-700 rounded-md transition"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="/dashboard" 
                  className="block py-2 px-4 text-white hover:bg-blue-700 rounded-md transition"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a 
                  href="/journal" 
                  className="block py-2 px-4 text-white hover:bg-blue-700 rounded-md transition"
                  onClick={() => setIsOpen(false)}
                >
                  Dream Journal
                </a>
              </li>
              <li>
                <a 
                  href="/practice" 
                  className="block py-2 px-4 text-white hover:bg-blue-700 rounded-md transition"
                  onClick={() => setIsOpen(false)}
                >
                  Practice
                </a>
              </li>
              <li>
                <a 
                  href="/resources" 
                  className="block py-2 px-4 text-white hover:bg-blue-700 rounded-md transition"
                  onClick={() => setIsOpen(false)}
                >
                  Resources
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  )
}
