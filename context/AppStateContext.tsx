import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { DailyWord, Submission, ArchivedWord, AiProvider } from '../types';
import { generateNonsenseWord, generateAbstractImage, summarizeDefinitions } from '../services/geminiService';

// --- Helper Functions ---

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const generateUniqueId = () => Math.random().toString(36).substring(2, 15);

const randomAdjectives = ["Curious", "Sleepy", "Quantum", "Chaotic", "Dreamy", "Vivid"];
const randomNouns = ["Duck", "Neuron", "Pixel", "Orb", "Molecule", "Quasar"];
const getRandomUsername = () => {
    const adj = randomAdjectives[Math.floor(Math.random() * randomAdjectives.length)];
    const noun = randomNouns[Math.floor(Math.random() * randomNouns.length)];
    const num = Math.floor(Math.random() * 99) + 1;
    return `${adj}-${noun}-${num}`;
};

// --- State Interface ---

interface AppState {
  currentWord: DailyWord | null;
  submissions: Submission[];
  archive: ArchivedWord[];
  username: string;
  previousDayResults: ArchivedWord | null;
  aiProvider: AiProvider;
  apiKeys: { gemini: string; openai: string; };
  isLoading: boolean;
  isSummarizing: boolean;
  isRegeneratingImage: boolean;
  addSubmission: (text: string) => void;
  likeSubmission: (id: string) => void;
  updateUsername: (name: string) => void;
  generateNewDay: () => Promise<void>;
  manuallySetWord: (word: string) => Promise<void>;
  triggerSummarization: () => Promise<void>;
  regenerateImage: () => Promise<void>;
  saveSettings: (settings: { provider: AiProvider; keys: { gemini: string; openai: string; } }) => boolean;
  clearPreviousDayResults: () => void;
}

// --- Context Definition ---

const AppStateContext = createContext<AppState | undefined>(undefined);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

// --- Provider Component ---

interface AppStateProviderProps {
  children: ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);
  
  const [currentWord, setCurrentWord] = useState<DailyWord | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [archive, setArchive] = useState<ArchivedWord[]>([]);
  const [username, setUsername] = useState<string>('');
  const [previousDayResults, setPreviousDayResults] = useState<ArchivedWord | null>(null);

  const [aiProvider, setAiProvider] = useState<AiProvider>('gemini');
  const [apiKeys, setApiKeys] = useState({ gemini: 'AIzaSyCDIU3LjvM0Fq_E2oBWpaLxBC3BFVA3l70', openai: '' });

  const getApiKey = useCallback(() => {
    return aiProvider === 'gemini' ? apiKeys.gemini : apiKeys.openai;
  }, [aiProvider, apiKeys]);

  const saveStateToLocalStorage = (state: Partial<AppState>) => {
    try {
      if (state.currentWord) localStorage.setItem('currentWord', JSON.stringify(state.currentWord));
      if (state.submissions) localStorage.setItem('submissions', JSON.stringify(state.submissions));
      if (state.archive) localStorage.setItem('archive', JSON.stringify(state.archive));
      if (state.username) localStorage.setItem('username', state.username);
      if (state.aiProvider) localStorage.setItem('aiProvider', state.aiProvider);
      if (state.apiKeys) localStorage.setItem('apiKeys', JSON.stringify(state.apiKeys));
    } catch (error) {
      console.error("Error saving state to local storage:", error);
    }
  };
  
  const generateNewDay = useCallback(async () => {
    setIsLoading(true);

    // 1. Check if there's a word from a previous day and if it has submissions
    if (currentWord && submissions.length > 0) {
      // Summarize and archive previous day
      const winningDefinitions = await summarizeDefinitions(aiProvider, getApiKey(), currentWord.word, submissions);
      const archivedEntry: ArchivedWord = { ...currentWord, winningDefinitions };
      
      setArchive(prev => [archivedEntry, ...prev]);
      setPreviousDayResults(archivedEntry);
    } else if (currentWord && submissions.length === 0) {
        // If there's a word but no submissions, just archive it with a default message
        const archivedEntry: ArchivedWord = { ...currentWord, winningDefinitions: ["No definitions were submitted for this word."] };
        setArchive(prev => [archivedEntry, ...prev]);
        setPreviousDayResults(archivedEntry);
    }

    // 2. Clear submissions for the new day
    setSubmissions([]);

    // 3. Generate a new word and image
    try {
        const apiKey = getApiKey();
        if (!apiKey) {
            alert('API Key is not set. Please set it in the admin panel (Shift+A+C).');
            setIsLoading(false);
            setCurrentWord(null);
            return;
        }
        const word = await generateNonsenseWord(aiProvider, apiKey);
        const image = await generateAbstractImage(aiProvider, apiKey, word);
        const newWord: DailyWord = { word, image, date: getTodayDateString() };
        setCurrentWord(newWord);
    } catch (e) {
        console.error("Failed to generate new day:", e);
        // Handle error state, maybe set a default word
        setCurrentWord({ word: "Error", image: undefined, date: getTodayDateString() });
    } finally {
        setIsLoading(false);
    }
  }, [currentWord, submissions, aiProvider, apiKeys, getApiKey]);

  useEffect(() => {
    // Load state from local storage on initial mount
    try {
      const savedWord = localStorage.getItem('currentWord');
      const savedSubmissions = localStorage.getItem('submissions');
      const savedArchive = localStorage.getItem('archive');
      const savedUsername = localStorage.getItem('username');
      const savedProvider = localStorage.getItem('aiProvider') as AiProvider;
      const savedKeys = localStorage.getItem('apiKeys');

      const today = getTodayDateString();
      const loadedWord: DailyWord | null = savedWord ? JSON.parse(savedWord) : null;
      
      if (savedProvider) setAiProvider(savedProvider);
      if (savedKeys) setApiKeys(JSON.parse(savedKeys));

      if (loadedWord && loadedWord.date === today) {
        setCurrentWord(loadedWord);
        if (savedSubmissions) setSubmissions(JSON.parse(savedSubmissions));
        setIsLoading(false);
      } else {
        // It's a new day, or no word exists
        generateNewDay();
      }

      if (savedArchive) setArchive(JSON.parse(savedArchive));
      setUsername(savedUsername || getRandomUsername());

    } catch (error) {
      console.error("Error loading state from local storage:", error);
      generateNewDay(); // Fallback to generating a new day if storage is corrupt
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
      // Persist state changes
      saveStateToLocalStorage({ currentWord, submissions, archive, username, aiProvider, apiKeys });
  }, [currentWord, submissions, archive, username, aiProvider, apiKeys]);

  const addSubmission = useCallback((text: string) => {
    if (!text.trim()) return;
    const newSubmission: Submission = {
      id: generateUniqueId(),
      text: text.trim(),
      username: username, // Use username state directly
      likes: 0,
    };
    setSubmissions(prev => [...prev, newSubmission]);
  }, [username]); // Add username as a dependency

  const likeSubmission = useCallback((id: string) => {
    setSubmissions(prev =>
      prev.map(sub => (sub.id === id ? { ...sub, likes: sub.likes + 1 } : sub))
    );
  }, []);

  const updateUsername = useCallback((name: string) => {
    const newName = name.trim() || "Anonymous";
    setUsername(newName);
  }, []);
  
  const manuallySetWord = async (word: string) => {
      setIsLoading(true);
      try {
        const image = await generateAbstractImage(aiProvider, getApiKey(), word);
        const newWord: DailyWord = { word, image, date: getTodayDateString() };
        setCurrentWord(newWord);
        setSubmissions([]); // Clear submissions for new word
      } catch (e) {
          console.error("Failed to set word manually:", e);
          alert("Failed to set word. Check API key and console for errors.");
      } finally {
          setIsLoading(false);
      }
  };

  const triggerSummarization = async () => {
    if (!currentWord || submissions.length === 0) return;
    setIsSummarizing(true);
    try {
        const winningDefinitions = await summarizeDefinitions(aiProvider, getApiKey(), currentWord.word, submissions);
        const archivedEntry: ArchivedWord = { ...currentWord, winningDefinitions };
        setArchive(prev => [archivedEntry, ...prev]);
        setPreviousDayResults(archivedEntry);
        // After summarization, we usually start a new day
        await generateNewDay();
    } catch (e) {
        console.error("Failed to trigger summarization:", e);
        alert("Summarization failed. Check API key and console for errors.");
    } finally {
        setIsSummarizing(false);
    }
  };

  const regenerateImage = async () => {
      if (!currentWord) return;
      setIsRegeneratingImage(true);
      try {
          const image = await generateAbstractImage(aiProvider, getApiKey(), currentWord.word);
          setCurrentWord(prev => prev ? { ...prev, image } : null);
      } catch(e) {
          console.error("Failed to regenerate image:", e);
          alert("Image regeneration failed. Check API key and console for errors.");
      } finally {
          setIsRegeneratingImage(false);
      }
  };

  const saveSettings = (settings: { provider: AiProvider; keys: { gemini: string; openai: string; } }) => {
    try {
        setAiProvider(settings.provider);
        setApiKeys(settings.keys);
        // Trigger validation or re-check
        if ((settings.provider === 'gemini' && !settings.keys.gemini) || (settings.provider === 'openai' && !settings.keys.openai)) {
            alert('Warning: API key for the selected provider is missing.');
        }
        return true;
    } catch (e) {
        console.error("Failed to save settings:", e);
        alert("Failed to save settings.");
        return false;
    }
  };
  
  const clearPreviousDayResults = () => {
    setPreviousDayResults(null);
  };
  
  const value = {
    currentWord,
    submissions,
    archive,
    username,
    previousDayResults,
    aiProvider,
    apiKeys,
    isLoading,
    isSummarizing,
    isRegeneratingImage,
    addSubmission,
    likeSubmission,
    updateUsername,
    generateNewDay,
    manuallySetWord,
    triggerSummarization,
    regenerateImage,
    saveSettings,
    clearPreviousDayResults,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};