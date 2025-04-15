import React from 'react';
import { DreamProvider } from '../lib/dream-context';
import MainLayout from '../components/MainLayout';
import DreamJournalList from '../components/DreamJournalList';
import PracticeSession from '../components/PracticeSession';
import ProgressTracking from '../components/ProgressTracking';
import BreathingGuide from '../components/BreathingGuide';

export default function Home() {
  return (
    <DreamProvider>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Lucid Dreams Application
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <DreamJournalList className="md:col-span-2" />
            <PracticeSession />
            <ProgressTracking />
          </div>
          
          <div className="mb-8">
            <BreathingGuide />
          </div>
        </div>
      </MainLayout>
    </DreamProvider>
  );
}
