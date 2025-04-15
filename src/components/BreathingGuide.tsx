import React from 'react';
import { useState, useEffect } from 'react';

interface BreathingGuideProps {
  className?: string;
}

export default function BreathingGuide({ className = '' }: BreathingGuideProps) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [breathingRate, setBreathingRate] = useState(4); // breaths per minute

  // Calculate durations based on breathing rate
  const cycleDuration = 60 / breathingRate; // seconds per breath cycle
  const inhaleDuration = cycleDuration * 0.4;
  const holdDuration = cycleDuration * 0.1;
  const exhaleDuration = cycleDuration * 0.4;
  const restDuration = cycleDuration * 0.1;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isActive) {
      timer = setInterval(() => {
        setCount(prevCount => {
          const newCount = prevCount + 0.1;
          
          // Determine phase based on count
          if (newCount < inhaleDuration) {
            setPhase('inhale');
          } else if (newCount < inhaleDuration + holdDuration) {
            setPhase('hold');
          } else if (newCount < inhaleDuration + holdDuration + exhaleDuration) {
            setPhase('exhale');
          } else if (newCount < cycleDuration) {
            setPhase('rest');
          }
          
          // Reset count at the end of cycle
          if (newCount >= cycleDuration) {
            return 0;
          }
          
          return newCount;
        });
      }, 100);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, inhaleDuration, holdDuration, exhaleDuration, restDuration, cycleDuration]);

  const toggleActive = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setCount(0);
      setPhase('inhale');
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBreathingRate(parseInt(e.target.value));
  };

  // Calculate progress percentages for visualization
  const getProgress = () => {
    let progress = 0;
    
    if (phase === 'inhale') {
      progress = (count / inhaleDuration) * 100;
    } else if (phase === 'hold') {
      progress = 100;
    } else if (phase === 'exhale') {
      const exhaleStart = inhaleDuration + holdDuration;
      const exhaleProgress = (count - exhaleStart) / exhaleDuration;
      progress = 100 - (exhaleProgress * 100);
    } else {
      progress = 0;
    }
    
    return Math.min(Math.max(progress, 0), 100);
  };

  return (
    <div className={`p-6 bg-black bg-opacity-30 backdrop-blur-sm rounded-lg shadow-xl ${className}`}>
      <h2 className="text-2xl font-bold mb-4">Breathing Guide</h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span>Breathing Rate: {breathingRate} breaths/min</span>
          <span>{cycleDuration.toFixed(1)} seconds/cycle</span>
        </div>
        
        <input
          type="range"
          min="2"
          max="10"
          value={breathingRate}
          onChange={handleRateChange}
          className="w-full"
          disabled={isActive}
        />
      </div>
      
      <div className="relative h-40 mb-6 bg-gray-800 rounded-lg overflow-hidden">
        <div 
          className="absolute bottom-0 left-0 right-0 bg-blue-500 transition-all duration-300"
          style={{ 
            height: `${getProgress()}%`,
            backgroundColor: phase === 'hold' ? '#9333ea' : '#3b82f6'
          }}
        ></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-white">
            {phase === 'inhale' && 'Inhale'}
            {phase === 'hold' && 'Hold'}
            {phase === 'exhale' && 'Exhale'}
            {phase === 'rest' && 'Rest'}
          </span>
        </div>
      </div>
      
      <button
        onClick={toggleActive}
        className={`w-full py-3 rounded-lg font-medium transition ${
          isActive 
            ? 'bg-red-600 hover:bg-red-700' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isActive ? 'Stop' : 'Start Breathing Exercise'}
      </button>
      
      <div className="mt-4 text-sm text-gray-400">
        <p>Proper breathing can help induce lucid dreams by increasing relaxation and awareness.</p>
        <p className="mt-1">Try this exercise before sleep or during WBTB (Wake Back To Bed) technique.</p>
      </div>
    </div>
  );
}
