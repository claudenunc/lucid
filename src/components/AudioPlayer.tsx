'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDreamContext } from '@/lib/dream-context'

interface AudioPlayerProps {
  className?: string
  src: string
  title: string
  description?: string
  duration: number // in seconds
  showWaveform?: boolean
  autoPlay?: boolean
  onComplete?: () => void
}

export default function AudioPlayer({
  className = '',
  src,
  title,
  description,
  duration,
  showWaveform = true,
  autoPlay = false,
  onComplete
}: AudioPlayerProps) {
  const { isAudioEnabled } = useDreamContext()
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  // Create audio element on mount
  useEffect(() => {
    const audio = new Audio(src)
    setAudioElement(audio)

    // Clean up on unmount
    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [src])

  // Set up audio event listeners
  useEffect(() => {
    if (!audioElement) return

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      if (onComplete) onComplete()
    }

    audioElement.addEventListener('timeupdate', handleTimeUpdate)
    audioElement.addEventListener('ended', handleEnded)

    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate)
      audioElement.removeEventListener('ended', handleEnded)
    }
  }, [audioElement, onComplete])

  // Handle play/pause
  const togglePlayback = () => {
    if (!audioElement || !isAudioEnabled) return

    if (isPlaying) {
      audioElement.pause()
    } else {
      audioElement.play()
    }
    setIsPlaying(!isPlaying)
  }

  // Format time as mm:ss
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={`p-4 rounded-lg bg-opacity-10 ${className}`}>
      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      {description && <p className="text-sm mb-3">{description}</p>}
      
      <div className="flex items-center space-x-3">
        <button 
          onClick={togglePlayback}
          disabled={!isAudioEnabled}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-600 text-white"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        
        <div className="flex-1">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600" 
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
