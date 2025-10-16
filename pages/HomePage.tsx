import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import WordOfTheDay from '../components/WordOfTheDay';
import SubmissionForm from '../components/SubmissionForm';
import LiveSubmissionsFeed from '../components/LiveSubmissionsFeed';
import LoadingSpinner from '../components/LoadingSpinner';
import AdminPanel from '../components/AdminPanel';
import PreviousDayResults from '../components/PreviousDayResults';

const HomePage: React.FC = () => {
  const { currentWord, isLoading, previousDayResults, clearPreviousDayResults } = useAppState();
  const [isAdminPanelVisible, setIsAdminPanelVisible] = useState(false);
  
  // New shortcut logic for Shift + A + C (case-insensitive)
  React.useEffect(() => {
    const pressed = new Set<string>();
    const targetKeys = new Set(['shift', 'a', 'c']);

    const handleKeyDown = (e: KeyboardEvent) => {
        pressed.add(e.key.toLowerCase());

        // Check if all target keys are pressed
        if (targetKeys.size <= pressed.size && [...targetKeys].every(key => pressed.has(key))) {
            e.preventDefault();
            setIsAdminPanelVisible(true);
            pressed.clear(); // Reset after triggering
        }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        pressed.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div className="space-y-12">
      <AdminPanel isVisible={isAdminPanelVisible} onClose={() => setIsAdminPanelVisible(false)} />
      
      {previousDayResults && (
        <PreviousDayResults results={previousDayResults} onClose={clearPreviousDayResults} />
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-96">
          <LoadingSpinner />
          <p className="mt-4 text-gray-500">Dreaming up a new word...</p>
        </div>
      ) : currentWord ? (
        <>
          <WordOfTheDay word={currentWord} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
            <div className="space-y-8">
              <h2 className="text-xl font-bold text-gray-800">What does "{currentWord.word}" mean to you?</h2>
              <SubmissionForm />
            </div>
            <LiveSubmissionsFeed />
          </div>
        </>
      ) : (
        <div className="text-center bg-gray-50 text-gray-500 p-8 rounded-lg flex flex-col items-center justify-center h-96 border border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-700">Something went wrong...</h3>
            <p className="mt-2 max-w-md">We couldn't generate a word. Please check your AI provider settings in the admin panel (Shift+A+C) or try refreshing the page.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;