'use client'

import React, { useState, useEffect } from 'react'
import { useDreamContext } from '@/lib/dream-context'
import { practiceSessionService } from '@/lib/api'

interface PracticeSessionProps {
  className?: string
}

type PracticeSession = {
  id: number
  protocol_type: string
  protocol_name: string
  duration_minutes: number
  effectiveness_rating: number
  notes: string
  created_at: string
}

export default function PracticeSession({ className = '' }: PracticeSessionProps) {
  const { user } = useDreamContext()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessions, setSessions] = useState<PracticeSession[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    protocolType: 'dream_navigation',
    protocolName: '',
    durationMinutes: 15,
    effectivenessRating: 5,
    notes: ''
  })
  
  // Protocol types
  const protocolTypes = [
    { id: 'dream_navigation', name: 'Dream Navigation' },
    { id: 'reality_manifestation', name: 'Reality Manifestation' },
    { id: 'intention_amplification', name: 'Intention Amplification' },
    { id: 'synchronicity', name: 'Synchronicity' }
  ]
  
  // Protocol names by type
  const protocolNamesByType: Record<string, string[]> = {
    dream_navigation: [
      'MILD (Mnemonic Induction of Lucid Dreams)',
      'WILD (Wake Initiated Lucid Dreams)',
      'WBTB (Wake Back To Bed)',
      'Dream Journaling'
    ],
    reality_manifestation: [
      'Reality Testing',
      'Meditation',
      'Visualization',
      'Affirmations'
    ],
    intention_amplification: [
      'Prospective Memory Training',
      'Intention Setting',
      'Mindfulness Practice',
      'Dream Incubation'
    ],
    synchronicity: [
      'Dream Signs Recognition',
      'Lucid Living',
      'Consciousness Expansion',
      'Dream Yoga'
    ]
  }
  
  // Fetch practice sessions
  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const data = await practiceSessionService.getAllSessions();
        setSessions(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching practice sessions:', err);
        setError(err.error || 'Failed to load practice sessions');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSessions();
  }, [user]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'durationMinutes' || name === 'effectivenessRating' 
        ? parseInt(value) 
        : value
    }));
    
    // Reset protocol name when protocol type changes
    if (name === 'protocolType') {
      setFormData(prev => ({
        ...prev,
        protocolName: ''
      }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.protocolName) {
      alert('Please select a protocol name');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const newSession = await practiceSessionService.createSession({
        protocolType: formData.protocolType,
        protocolName: formData.protocolName,
        durationMinutes: formData.durationMinutes,
        effectivenessRating: formData.effectivenessRating,
        notes: formData.notes
      });
      
      // Add new session to the list
      setSessions(prev => [newSession, ...prev]);
      
      // Reset form and close it
      setFormData({
        protocolType: 'dream_navigation',
        protocolName: '',
        durationMinutes: 15,
        effectivenessRating: 5,
        notes: ''
      });
      setIsFormOpen(false);
      
    } catch (err: any) {
      console.error('Error creating practice session:', err);
      alert(err.error || 'Failed to create practice session');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get color based on effectiveness rating
  const getEffectivenessColor = (rating: number) => {
    if (rating >= 8) return 'bg-green-500';
    if (rating >= 5) return 'bg-blue-500';
    if (rating >= 3) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  if (isLoading && sessions.length === 0) {
    return (
      <div className={`p-6 bg-black bg-opacity-30 backdrop-blur-sm rounded-lg shadow-xl ${className}`}>
        <h2 className="text-2xl font-bold mb-6">Practice Sessions</h2>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse p-4 bg-gray-800 bg-opacity-50 rounded-lg">
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className={`p-6 bg-black bg-opacity-30 backdrop-blur-sm rounded-lg shadow-xl ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Practice Sessions</h2>
        
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition"
        >
          {isFormOpen ? 'Cancel' : 'New Session'}
        </button>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded">
          <p className="text-red-300">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-sm transition"
          >
            Try Again
          </button>
        </div>
      )}
      
      {isFormOpen && (
        <div className="mb-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg">
          <h3 className="text-xl font-medium mb-4">New Practice Session</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="protocolType" className="block mb-1 font-medium">
                  Protocol Type
                </label>
                <select
                  id="protocolType"
                  name="protocolType"
                  value={formData.protocolType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {protocolTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="protocolName" className="block mb-1 font-medium">
                  Protocol Name
                </label>
                <select
                  id="protocolName"
                  name="protocolName"
                  value={formData.protocolName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a protocol</option>
                  {protocolNamesByType[formData.protocolType]?.map(name => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="durationMinutes" className="block mb-1 font-medium">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  id="durationMinutes"
                  name="durationMinutes"
                  min="1"
                  max="180"
                  value={formData.durationMinutes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="effectivenessRating" className="block mb-1 font-medium">
                  Effectiveness (1-10)
                </label>
                <input
                  type="range"
                  id="effectivenessRating"
                  name="effectivenessRating"
                  min="1"
                  max="10"
                  value={formData.effectivenessRating}
                  onChange={handleChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Not Effective</span>
                  <span>Very Effective</span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="notes" className="block mb-1 font-medium">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Optional notes about your practice session..."
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Session'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {sessions.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No practice sessions recorded yet
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map(session => (
            <div 
              key={session.id}
              className="p-4 bg-gray-800 bg-opacity-50 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium">{session.protocol_name}</h3>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getEffectivenessColor(session.effectiveness_rating)}`}>
                  Rating: {session.effectiveness_rating}/10
                </div>
              </div>
              
              <div className="text-sm text-gray-400 mb-2">
                {formatDate(session.created_at)} • {session.duration_minutes} minutes
              </div>
              
              <div className="text-sm mb-2">
                <span className="text-blue-400">Protocol Type:</span>{' '}
                {session.protocol_type.replace('_', ' ')}
              </div>
              
              {session.notes && (
                <p className="text-gray-300 border-t border-gray-700 pt-2 mt-2">
                  {session.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
