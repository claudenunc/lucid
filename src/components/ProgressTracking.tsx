import React, { useState, useEffect } from 'react';

interface ProgressTrackingProps {
  className?: string;
}

type ProgressMetric = {
  id: number;
  date: string;
  lucidDreams: number;
  practiceMinutes: number;
  consistencyScore: number;
};

export default function ProgressTracking({ className = '' }: ProgressTrackingProps) {
  const [metrics, setMetrics] = useState<ProgressMetric[]>([
    { id: 1, date: '2025-04-14', lucidDreams: 2, practiceMinutes: 45, consistencyScore: 0.8 },
    { id: 2, date: '2025-04-13', lucidDreams: 1, practiceMinutes: 30, consistencyScore: 0.7 },
    { id: 3, date: '2025-04-12', lucidDreams: 0, practiceMinutes: 20, consistencyScore: 0.5 },
    { id: 4, date: '2025-04-11', lucidDreams: 1, practiceMinutes: 35, consistencyScore: 0.6 },
    { id: 5, date: '2025-04-10', lucidDreams: 2, practiceMinutes: 50, consistencyScore: 0.9 },
    { id: 6, date: '2025-04-09', lucidDreams: 0, practiceMinutes: 15, consistencyScore: 0.4 },
    { id: 7, date: '2025-04-08', lucidDreams: 1, practiceMinutes: 25, consistencyScore: 0.6 }
  ]);
  
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [isClient, setIsClient] = useState(false);
  
  // Fix for hydration error - use useEffect to indicate client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Calculate totals and averages
  const totalLucidDreams = metrics.reduce((sum, metric) => sum + metric.lucidDreams, 0);
  const totalPracticeMinutes = metrics.reduce((sum, metric) => sum + metric.practiceMinutes, 0);
  const averageConsistency = metrics.reduce((sum, metric) => sum + metric.consistencyScore, 0) / metrics.length;
  
  // Format date - simplified to avoid hydration errors
  const formatDate = (dateString: string) => {
    return dateString;
  };
  
  // Get height percentage for bar chart
  const getHeightPercentage = (value: number, maxValue: number) => {
    return (value / maxValue) * 100;
  };
  
  // Get max values for scaling
  const maxLucidDreams = Math.max(...metrics.map(m => m.lucidDreams), 1);
  const maxPracticeMinutes = Math.max(...metrics.map(m => m.practiceMinutes), 1);
  
  return (
    <div className={`p-6 bg-black bg-opacity-30 backdrop-blur-sm rounded-lg shadow-xl ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Progress Tracking</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded-md transition ${
              timeRange === 'week' 
                ? 'bg-blue-600' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded-md transition ${
              timeRange === 'month' 
                ? 'bg-blue-600' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-3 py-1 rounded-md transition ${
              timeRange === 'year' 
                ? 'bg-blue-600' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Year
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-800 bg-opacity-50 rounded-lg text-center">
          <div className="text-3xl font-bold text-blue-400">{totalLucidDreams}</div>
          <div className="text-sm text-gray-400">Lucid Dreams</div>
        </div>
        
        <div className="p-4 bg-gray-800 bg-opacity-50 rounded-lg text-center">
          <div className="text-3xl font-bold text-purple-400">{totalPracticeMinutes}</div>
          <div className="text-sm text-gray-400">Practice Minutes</div>
        </div>
        
        <div className="p-4 bg-gray-800 bg-opacity-50 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-400">{(averageConsistency * 100).toFixed(0)}%</div>
          <div className="text-sm text-gray-400">Consistency</div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Lucid Dreams & Practice</h3>
        
        <div className="flex items-end h-40 space-x-1">
          {metrics.map(metric => (
            <div key={metric.id} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center space-y-1">
                <div 
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${getHeightPercentage(metric.lucidDreams, maxLucidDreams)}%` }}
                ></div>
                
                <div 
                  className="w-full bg-purple-500 rounded-t"
                  style={{ height: `${getHeightPercentage(metric.practiceMinutes, maxPracticeMinutes)}%` }}
                ></div>
              </div>
              
              <div className="text-xs mt-1 text-gray-400">
                {metric.date}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center space-x-4 mt-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span className="text-xs text-gray-400">Lucid Dreams</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
            <span className="text-xs text-gray-400">Practice Minutes</span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Consistency Score</h3>
        
        <div className="flex items-end h-20 space-x-1">
          {metrics.map(metric => (
            <div key={metric.id} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-green-500 rounded-t"
                style={{ height: `${metric.consistencyScore * 100}%` }}
              ></div>
              
              <div className="text-xs mt-1 text-gray-400">
                {metric.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
