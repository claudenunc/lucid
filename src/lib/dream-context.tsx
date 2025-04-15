'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService } from './api'

type Theme = 'lucid' | 'cosmic' | 'ethereal' | 'deep'

type User = {
  id: number
  username: string
  email: string
  displayName?: string
  avatar?: string
} | null

interface DreamContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isAudioEnabled: boolean
  setIsAudioEnabled: (enabled: boolean) => void
  breathingRate: number
  setBreathingRate: (rate: number) => void
  user: User
  setUser: (user: User) => void
  isLoading: boolean
}

const DreamContext = createContext<DreamContextType | undefined>(undefined)

export function DreamProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('lucid')
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [breathingRate, setBreathingRate] = useState(4)
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Check for authenticated user on initial load
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Clear invalid token
          authService.logout();
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  // Load preferences from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedAudioEnabled = localStorage.getItem('isAudioEnabled');
    const savedBreathingRate = localStorage.getItem('breathingRate');
    
    if (savedTheme) setTheme(savedTheme);
    if (savedAudioEnabled !== null) setIsAudioEnabled(savedAudioEnabled === 'true');
    if (savedBreathingRate) setBreathingRate(parseInt(savedBreathingRate));
  }, []);
  
  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('isAudioEnabled', isAudioEnabled.toString());
    localStorage.setItem('breathingRate', breathingRate.toString());
  }, [theme, isAudioEnabled, breathingRate]);
  
  return (
    <DreamContext.Provider
      value={{
        theme,
        setTheme,
        isAudioEnabled,
        setIsAudioEnabled,
        breathingRate,
        setBreathingRate,
        user,
        setUser,
        isLoading
      }}
    >
      {children}
    </DreamContext.Provider>
  )
}

export function useDreamContext() {
  const context = useContext(DreamContext)
  if (context === undefined) {
    throw new Error('useDreamContext must be used within a DreamProvider')
  }
  return context
}
