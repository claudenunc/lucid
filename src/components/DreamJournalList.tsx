'use client'

import React, { useState, useEffect } from 'react'
import { useDreamContext } from '@/lib/dream-context'
import { dreamJournalService } from '@/lib/api'

interface DreamJournalListProps {
  className?: string
  limit?: number
  onSelectEntry?: (entryId: number) => void
}

type DreamJournalEntry = {
  id: number
  title: string
  dream_date: string
  lucidity_level: number
  tags: string[]
  content: string
}

export default function DreamJournalList({ 
  className = '', 
  limit,
  onSelectEntry 
}: DreamJournalListProps) {
  const { user } = useDreamContext()
  const [entries, setEntries] = useState<DreamJournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'lucidity'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Fetch dream journal entries
  useEffect(() => {
    const fetchEntries = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const data = await dreamJournalService.getAllEntries();
        setEntries(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching dream journal entries:', err);
        setError(err.error || 'Failed to load dream journal entries');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, [user]);

  // Filter and sort entries
  const filteredAndSortedEntries = entries
    .filter(entry => 
      filter === '' || 
      entry.title.toLowerCase().includes(filter.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase())) ||
      entry.content.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.dream_date).getTime() - new Date(b.dream_date).getTime()
          : new Date(b.dream_date).getTime() - new Date(a.dream_date).getTime()
      } else {
        return sortOrder === 'asc'
          ? a.lucidity_level - b.lucidity_level
          : b.lucidity_level - a.lucidity_level
      }
    })
    .slice(0, limit)

  // Get color based on lucidity level
  const getLucidityColor = (level: number) => {
    if (level >= 8) return 'bg-blue-500'
    if (level >= 5) return 'bg-green-500'
    if (level >= 3) return 'bg-yellow-500'
    return 'bg-gray-500'
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  // Handle creating a new entry
  const handleNewEntry = () => {
    // Navigate to new entry form or open modal
    // This would be implemented based on the app's navigation structure
    console.log('Create new entry');
  }

  if (isLoading) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Dream Journal</h2>
          <div className="animate-pulse w-24 h-8 bg-gray-700 rounded"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse p-4 bg-gray-800 bg-opacity-50 rounded-lg">
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-4 ${className}`}>
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
    )
  }

  return (
    <div className={`p-4 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        <h2 className="text-xl font-semibold">Dream Journal</h2>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search dreams..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-') as ['date' | 'lucidity', 'asc' | 'desc']
              setSortBy(newSortBy)
              setSortOrder(newSortOrder)
            }}
            className="px-3 py-1 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="lucidity-desc">Highest lucidity</option>
            <option value="lucidity-asc">Lowest lucidity</option>
          </select>
        </div>
      </div>
      
      {filteredAndSortedEntries.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          {filter ? 'No dreams match your search' : 'No dream journal entries yet'}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedEntries.map(entry => (
            <div 
              key={entry.id}
              onClick={() => onSelectEntry && onSelectEntry(entry.id)}
              className="p-4 bg-gray-800 bg-opacity-50 hover:bg-opacity-70 rounded-lg transition cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium">{entry.title}</h3>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getLucidityColor(entry.lucidity_level)}`}>
                  Lucidity: {entry.lucidity_level}/10
                </div>
              </div>
              
              <div className="text-sm text-gray-400 mb-2">
                {formatDate(entry.dream_date)}
              </div>
              
              <p className="text-gray-300 line-clamp-2 mb-2">
                {entry.content}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {entry.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-2 py-0.5 bg-blue-900 bg-opacity-50 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!limit && (
        <div className="mt-6 text-center">
          <button 
            onClick={handleNewEntry}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition"
          >
            New Dream Entry
          </button>
        </div>
      )}
    </div>
  )
}
