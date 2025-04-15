'use client'

import React, { useState, useEffect } from 'react'
import { useDreamContext } from '@/lib/dream-context'
import { audioResourceService } from '@/lib/api'

interface AudioResourceLibraryProps {
  className?: string
  onSelectResource?: (resource: AudioResource) => void
}

type AudioResource = {
  id: number
  title: string
  description: string
  protocol_type: string
  duration_seconds: number
  file_path: string
}

export default function AudioResourceLibrary({ 
  className = '',
  onSelectResource
}: AudioResourceLibraryProps) {
  const { theme } = useDreamContext()
  const [filter, setFilter] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [resources, setResources] = useState<AudioResource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch audio resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        const data = await audioResourceService.getAllResources(selectedCategory);
        setResources(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching audio resources:', err);
        setError(err.error || 'Failed to load audio resources');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResources();
  }, [selectedCategory]);
  
  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Resources' },
    { id: 'dream_navigation', name: 'Dream Navigation' },
    { id: 'reality_manifestation', name: 'Reality Manifestation' },
    { id: 'intention_amplification', name: 'Intention Amplification' },
    { id: 'synchronicity', name: 'Synchronicity' }
  ]
  
  // Filter resources based on search
  const filteredResources = resources.filter(resource => {
    return filter === '' || 
      resource.title.toLowerCase().includes(filter.toLowerCase()) ||
      resource.description.toLowerCase().includes(filter.toLowerCase());
  });
  
  // Format duration as mm:ss
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  
  // Get background color based on protocol type
  const getProtocolColor = (type: string) => {
    switch (type) {
      case 'dream_navigation':
        return 'bg-blue-600'
      case 'reality_manifestation':
        return 'bg-purple-600'
      case 'intention_amplification':
        return 'bg-green-600'
      case 'synchronicity':
        return 'bg-yellow-600'
      default:
        return 'bg-gray-600'
    }
  }
  
  // Handle play button click
  const handlePlay = (resource: AudioResource) => {
    if (onSelectResource) {
      onSelectResource(resource);
    } else {
      // Get audio URL
      const audioUrl = audioResourceService.getAudioFileUrl(resource.file_path.split('/').pop() || '');
      
      // Create and play audio element
      const audio = new Audio(audioUrl);
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className={`p-6 bg-black bg-opacity-30 backdrop-blur-sm rounded-lg shadow-xl ${className}`}>
        <h2 className="text-2xl font-bold mb-6">Audio Resources</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category, index) => (
            <div key={index} className="animate-pulse bg-gray-700 h-8 w-24 rounded-full"></div>
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse p-4 bg-gray-800 bg-opacity-50 rounded-lg">
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`p-6 bg-black bg-opacity-30 backdrop-blur-sm rounded-lg shadow-xl ${className}`}>
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`p-6 bg-black bg-opacity-30 backdrop-blur-sm rounded-lg shadow-xl ${className}`}>
      <h2 className="text-2xl font-bold mb-6">Audio Resources</h2>
      
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search resources..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 text-sm rounded-full ${
                selectedCategory === category.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {filteredResources.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No audio resources match your search
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResources.map(resource => (
            <div 
              key={resource.id}
              className="p-4 bg-gray-800 bg-opacity-50 hover:bg-opacity-70 rounded-lg transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium">{resource.title}</h3>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getProtocolColor(resource.protocol_type)}`}>
                  {formatDuration(resource.duration_seconds)}
                </div>
              </div>
              
              <p className="text-gray-300 mb-3">
                {resource.description}
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  {resource.protocol_type.replace('_', ' ')}
                </span>
                
                <button 
                  onClick={() => handlePlay(resource)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-sm transition"
                >
                  Play
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
