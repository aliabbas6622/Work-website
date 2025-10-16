import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/AppStateContext';
import { AiProvider } from '../types';

interface AdminPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isVisible, onClose }) => {
  const { 
    submissions, 
    generateNewDay, 
    manuallySetWord, 
    triggerSummarization, 
    isSummarizing, 
    regenerateImage, 
    isRegeneratingImage, 
    currentWord,
    aiProvider,
    apiKeys,
    saveSettings
  } = useAppState();
  
  const [manualWord, setManualWord] = useState('');
  const [localKeys, setLocalKeys] = useState(apiKeys);
  const [localProvider, setLocalProvider] = useState(aiProvider);

  useEffect(() => {
    setLocalKeys(apiKeys);
    setLocalProvider(aiProvider);
  }, [apiKeys, aiProvider, isVisible]);

  const handleSetWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualWord.trim()) {
      manuallySetWord(manualWord.trim());
      setManualWord('');
    }
  };

  const handleSaveSettings = () => {
    const success = saveSettings({ provider: localProvider, keys: localKeys });
    if (success) {
      alert('Settings saved!');
      onClose();
    }
  };
  
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 md:p-8 animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h3 className="text-2xl font-bold text-gray-800 mb-6">Admin Panel</h3>
        
        {/* Settings Section */}
        <div className="space-y-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-lg text-gray-700">AI Settings</h4>
            {/* Provider Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">AI Provider</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="provider" value="gemini" checked={localProvider === 'gemini'} onChange={() => setLocalProvider('gemini')} className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"/>
                        <span className="font-medium">Google Gemini</span>
                    </label>
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="provider" value="openai" checked={localProvider === 'openai'} onChange={() => setLocalProvider('openai')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"/>
                        <span className="font-medium">OpenAI</span>
                    </label>
                </div>
            </div>
            {/* API Keys */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="gemini-key" className="block text-sm font-medium text-gray-600">Gemini API Key</label>
                    <input id="gemini-key" type="password" value={localKeys.gemini} onChange={e => setLocalKeys(k => ({...k, gemini: e.target.value}))} className="mt-1 block w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all text-gray-900"/>
                </div>
                 <div>
                    <label htmlFor="openai-key" className="block text-sm font-medium text-gray-600">OpenAI API Key</label>
                    <input id="openai-key" type="password" value={localKeys.openai} onChange={e => setLocalKeys(k => ({...k, openai: e.target.value}))} className="mt-1 block w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all text-gray-900"/>
                </div>
            </div>
        </div>

        {/* Actions Section */}
        <div className="mt-6 space-y-4">
            <h4 className="font-semibold text-lg text-gray-700">Actions</h4>
             <form onSubmit={handleSetWord} className="flex gap-2 items-center">
                <input type="text" value={manualWord} onChange={(e) => setManualWord(e.target.value)} placeholder="Set daily word manually..." className="flex-grow p-2 bg-white border-2 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-gray-900"/>
                <button type="submit" className="py-2 px-4 bg-gray-700 hover:bg-gray-800 text-white font-bold rounded-md transition-colors">Set</button>
            </form>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
               <button onClick={() => regenerateImage()} disabled={!currentWord || isRegeneratingImage} className="py-2 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold rounded-md transition-colors">
                {isRegeneratingImage ? 'Regenerating...' : 'Regenerate Image'}
              </button>
              <button onClick={() => generateNewDay()} className="py-2 px-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-md transition-colors">New Day</button>
              <button onClick={() => triggerSummarization()} disabled={submissions.length === 0 || isSummarizing} className="py-2 px-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold rounded-md transition-colors">
                {isSummarizing ? 'Summarizing...' : `Summarize (${submissions.length})`}
              </button>
            </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
            <button onClick={handleSaveSettings} className="py-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md transition-colors shadow-sm">
                Save & Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;