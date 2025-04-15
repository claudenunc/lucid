'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useDreamContext } from '@/lib/dream-context'

interface LucidityScaleProps {
  className?: string
  value: number
  onChange: (value: number) => void
  showLabels?: boolean
}

export default function LucidityScale({
  className = '',
  value,
  onChange,
  showLabels = true
}: LucidityScaleProps) {
  const { theme } = useDreamContext()
  const [hoveredValue, setHoveredValue] = useState<number | null>(null)

  // Get color gradient based on theme
  const getGradientColors = () => {
    switch (theme) {
      case 'cosmic':
        return ['#4b0082', '#8a2be2', '#9370db'] // Indigo to medium purple
      case 'ethereal':
        return ['#20b2aa', '#40e0d0', '#7fffd4'] // Light sea green to aquamarine
      case 'lucid':
        return ['#1e90ff', '#4682b4', '#87ceeb'] // Dodger blue to sky blue
      case 'deep':
        return ['#000080', '#191970', '#4169e1'] // Navy to royal blue
      default:
        return ['#4b0082', '#8a2be2', '#9370db'] // Default purple gradient
    }
  }

  const [startColor, midColor, endColor] = getGradientColors()

  // Labels for lucidity levels
  const lucidityLabels = [
    'Non-lucid',
    'Vague awareness',
    'Brief lucidity',
    'Partial control',
    'Clear awareness',
    'Stable lucidity',
    'Good control',
    'High awareness',
    'Extended lucidity',
    'Complete lucidity'
  ]

  return (
    <div className={`w-full ${className}`}>
      {showLabels && (
        <div className="flex justify-between mb-2 text-sm">
          <span>Non-lucid</span>
          <span>Partial lucidity</span>
          <span>Complete lucidity</span>
        </div>
      )}
      
      {/* Scale implementation would go here */}
    </div>
  )
}
