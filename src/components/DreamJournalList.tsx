import React, { useState } from 'react';

interface DreamJournalListProps {
  className?: string;
}

type DreamEntry = {
  id: number;
  title: string;
  content: string;
  dreamDate: string;
  lucidityLevel: number;
  tags: string[];
};

export default function DreamJournalList({ className = '' }: DreamJournalListProps) {
  const [entries, setEntries] = useState<DreamEntry[]>([
    {
      id: 1,
      title: "Flying Over Mountains",
      content: "I was flying over snow-capped mountains. The air was crisp and I could control my direction. When I realized I was dreaming, I flew higher and explored the landscape below.",
      dreamDate: "2025-04-14",
      lucidityLevel: 8,
      tags: ["flying", "lucid", "mountains"]
    },
    {
      id: 2,
      title: "Underwater City",
      content: "I discovered an ancient city beneath the ocean. The buildings were made of coral and crystal. Fish of all colors swam through the streets. I could breathe underwater.",
      dreamDate: "2025-04-12",
      lucidityLevel: 5,
      tags: ["water", "city", "exploration"]
    },
    {
      id: 3,
      title: "Time Travel",
      content: "I was in a medieval castle. People were dressed in period clothing. I realized I was dreaming when I saw a digital clock on the wall. I then tried to move forward in time by spinning.",
      dreamDate: "2025-04-10",
      lucidityLevel: 7,
      tags: ["time", "lucid", "historical"]
    }
  ]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    dreamDate: new Date().toISOString().split('T')[0],
    lucidityLevel: 5,
    tags: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEntry: DreamEntry = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      dreamDate: formData.dreamDate,
      lucidityLevel: Number(formData.lucidityLevel),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    };
    
    setEntries(prev => [newEntry, ...prev]);
    setIsFormOpen(false);
    setFormData({
      title: '',
      content: '',
      dreamDate: new Date().toISOString().split('T')[0],
      lucidityLevel: 5,
      tags: ''
    });
  };
  
  const getLucidityColor = (level: number) => {
    if (level >= 8) return 'bg-purple-500';
    if (level >= 6) return 'bg-blue-500';
    if (level >= 4) return 'bg-green-500';
    if (level >= 2) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Fix for hydration error - use client-side only formatting
  const formatDate = (dateString: string) => {
    if (typeof window === 'undefined') {
      return dateString; // Return simple string on server
    }
    
    // Only run this on the client
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <div className={`p-6 bg-black bg-opacity-30 backdrop-blur-sm rounded-lg shadow-xl ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dream Journal</h2>
        
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition"
        >
          {isFormOpen ? 'Cancel' : 'New Entry'}
        </button>
      </div>
      
      {isFormOpen && (
        <div className="mb-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg">
          <h3 className="text-xl font-medium mb-4">New Dream Journal Entry</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block mb-1 font-medium">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter dream title..."
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="dreamDate" className="block mb-1 font-medium">
                Dream Date
              </label>
              <input
                type="date"
                id="dreamDate"
                name="dreamDate"
                value={formData.dreamDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="content" className="block mb-1 font-medium">
                Dream Description
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your dream in detail..."
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label htmlFor="lucidityLevel" className="block mb-1 font-medium">
                Lucidity Level (1-10): {formData.lucidityLevel}
              </label>
              <input
                type="range"
                id="lucidityLevel"
                name="lucidityLevel"
                min="1"
                max="10"
                value={formData.lucidityLevel}
                onChange={handleChange}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Not Lucid</span>
                <span>Fully Lucid</span>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="tags" className="block mb-1 font-medium">
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="flying, lucid, water, etc..."
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition"
              >
                Save Entry
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="space-y-4">
        {entries.map(entry => (
          <div 
            key={entry.id}
            className="p-4 bg-gray-800 bg-opacity-50 rounded-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium">{entry.title}</h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getLucidityColor(entry.lucidityLevel)}`}>
                Lucidity: {entry.lucidityLevel}/10
              </div>
            </div>
            
            <div className="text-sm text-gray-400 mb-2">
              {entry.dreamDate}
            </div>
            
            <p className="mb-3 text-gray-300">{entry.content}</p>
            
            {entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {entry.tags.map(tag => (
                  <span 
                    key={tag}
                    className="px-2 py-1 bg-gray-700 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
