'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useDreamContext } from '@/lib/dream-context'

interface BreathingGuideProps {
  className?: string
  mode?: 'meditation' | 'protocol' | 'relaxation'
  duration?: number // in seconds
  onComplete?: () => void
}

export default function BreathingGuide({
  className = '',
  mode = 'meditation',
  duration = 120, // 2 minutes default
  onComplete
}: BreathingGuideProps) {
  const { breathingRate } = useDreamContext()
  const [isActive, setIsActive] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale')
  const [timeRemaining, setTimeRemaining] = useState(duration)
  const [instruction, setInstruction] = useState('Prepare to begin')

  // Get breathing pattern based on mode
  const getBreathingPattern = () => {
    switch (mode) {
      case 'protocol':
        // 4-4-4-4 pattern for protocols (box breathing)
        return { inhale: 4, hold1: 4, exhale: 4, hold2: 4 }
      case 'relaxation':
        // 4-7-8 pattern for relaxation
        return { inhale: 4, hold1: 7, exhale: 8, hold2: 0 }
      case 'meditation':
      default:
        // Adjustable based on breathingRate from context
        return { inhale: breathingRate, hold1: breathingRate, exhale: breathingRate, hold2: breathingRate / 2 }
    }
  }

  // Start/stop the breathing guide
  const toggleActive = () => {
    setIsActive(!isActive)
    if (!isActive) {
      setTimeRemaining(duration)
      setCurrentPhase('inhale')
    }
  }

  // Update instruction text based on current phase
  useEffect(() => {
    switch (currentPhase) {
      case 'inhale':
        setInstruction('Inhale slowly')
        break
      case 'hold1':
        setInstruction('Hold your breath')
        break
      case 'exhale':
        setInstruction('Exhale slowly')
        break
      case 'hold2':
        setInstruction('Hold before inhaling')
        break
    }
  }, [currentPhase])

  return (
    <div className={`p-4 rounded-lg bg-opacity-10 ${className}`}>
      <h3 className="text-xl font-semibold mb-2">Breathing Guide</h3>
      <div className="text-center mb-4">
        <div className="text-2xl font-bold">{instruction}</div>
        <div className="text-sm">Time remaining: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</div>
      </div>
      
      <button 
        onClick={toggleActive}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {isActive ? 'Stop' : 'Start'} Breathing Guide
      </button>
    </div>
  )
}
