'use client'

import React from 'react'
import { DreamProvider } from '@/lib/dream-context'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <DreamProvider>
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white">
        <header className="sticky top-0 z-10 bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Lucid</h1>
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li><a href="/" className="hover:text-blue-300 transition">Home</a></li>
                <li><a href="/dashboard" className="hover:text-blue-300 transition">Dashboard</a></li>
                <li><a href="/journal" className="hover:text-blue-300 transition">Dream Journal</a></li>
                <li><a href="/practice" className="hover:text-blue-300 transition">Practice</a></li>
                <li><a href="/resources" className="hover:text-blue-300 transition">Resources</a></li>
              </ul>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-blue-600 hover:bg-blue-700">
                <span className="sr-only">Settings</span>
                {/* Settings icon would go here */}
              </button>
              <button className="p-2 rounded-full bg-blue-600 hover:bg-blue-700">
                <span className="sr-only">Profile</span>
                {/* Profile icon would go here */}
              </button>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        
        <footer className="bg-black bg-opacity-30 py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-gray-400">© 2025 Lucid Dreams. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </DreamProvider>
  )
}
