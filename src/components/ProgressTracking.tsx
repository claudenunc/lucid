'use client'

import React, { useState, useEffect } from 'react'
import { useDreamContext } from '@/lib/dream-context'
import { progressTrackingService } from '@/lib/api'

interface ProgressTrackingProps {
  className?: string
}

type ProgressData = {
  date: string
  lucid_dreams: number
  practice_minutes: number
  consistency_score: number
}

export default function ProgressTracking({ className = '' }: ProgressTrackingProps) {
  const { user } = useDreamContext()
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [progressData, setProgressData] = useState<ProgressData[]>([])
  const [summary, setSummary] = useState({
    totalLucidDreams: 0,
    totalPracticeMinutes: 0,
    averageConsistency: 0
  })
  const [streak, setStreak] = useState({
    current: 0,
    longest: 0
  })
  
  // Fetch progress data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch metrics
        const metrics = await progressTrackingService.getMetrics(timeRange);
        setProgressData(metrics);
        
        // Fetch summary
        const summaryData = await progressTrackingService.getSummary(timeRange);
        setSummary(summaryData);
        
        // Fetch streak
        const streakData = await progressTrackingService.getStreak();
        setStreak(streakData);
        
        setError(null);
      } catch (err: any) {
        console.error('Error fetching progress data:', err);
        setError(err.error || 'Failed to load progress data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user, timeRange]);
  
  // Format date label based on time range
  const formatDateLabel = (dateStr: string) => {
    if (timeRange === 'week') {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (timeRange === 'month') {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      // For year view, extract month
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short' });
    }
  }
  
  // Find the maximum value for scaling the chart
  const maxLucidDreams = Math.max(...progressData.map(item => item.lucid_dreams), 1);
  const maxBarHeight = 150; // pixels
  
  if (isLoading) {
    return (
      <div className={`p-6 bg-black bg-opacity-30 backdrop-blur-sm rounded-lg shadow-xl ${className}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Progress Tracking</h2>
          <div className="animate-pulse w-32 h-8 bg-gray-700 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-gray-800 bg-opacity-50 p-4 rounded-lg">
              <div className="h-6 bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-700 rounded w-1/3 mb-1"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
        <div className="animate-pulse h-48 bg-gray-800 bg-opacity-50 rounded-lg mb-6"></div>
        <div className="animate-pulse h-12 bg-gray-800 bg-opacity-50 rounded-lg"></div>
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Progress Tracking</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded ${
              timeRange === 'week' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded ${
              timeRange === 'month' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-3 py-1 rounded ${
              timeRange === 'year' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Year
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-1">Lucid Dreams</h3>
          <p className="text-3xl font-bold">{summary.totalLucidDreams}</p>
          <p className="text-sm text-gray-400">Total this {timeRange}</p>
        </div>
        
        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-1">Practice Time</h3>
          <p className="text-3xl font-bold">{summary.totalPracticeMinutes} min</p>
          <p className="text-sm text-gray-400">Total this {timeRange}</p>
        </div>
        
        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-1">Consistency</h3>
          <p className="text-3xl font-bold">{(summary.averageConsistency * 100).toFixed(0)}%</p>
          <p className="text-sm text-gray-400">Average this {timeRange}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Lucid Dreams Chart</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Current Streak:</span>
            <span className="px-2 py-1 bg-blue-600 rounded-full text-xs font-medium">{streak.current} days</span>
          </div>
        </div>
        
        {progressData.length === 0 ? (
          <div className="h-48 flex items-center justify-center bg-gray-800 bg-opacity-30 rounded-lg">
            <p className="text-gray-400">No data available for this time period</p>
          </div>
        ) : (
          <div className="h-48 flex items-end space-x-2">
            {progressData.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-blue-600 rounded-t"
                  style={{ 
                    height: `${(item.lucid_dreams / maxLucidDreams) * maxBarHeight}px`,
                    minHeight: item.lucid_dreams > 0 ? '20px' : '4px'
                  }}
                ></div>
                <div className="text-xs mt-2 text-gray-400">{formatDateLabel(item.date)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Practice Consistency</h3>
        <div className="h-8 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
            style={{ width: `${summary.averageConsistency * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs mt-1 text-gray-400">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  )
}
