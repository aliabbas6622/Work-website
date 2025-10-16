import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import UsernameInput from './UsernameInput';

const SubmissionForm: React.FC = () => {
  const { addSubmission } = useAppState();
  const [text, setText] = useState('');
  const maxLength = 280;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addSubmission(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g., The quiet hum of a sleeping city..."
          className="w-full h-32 p-4 bg-white border-2 border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all text-gray-900"
          maxLength={maxLength}
        />
        <span className="absolute bottom-3 right-3 text-sm text-gray-400">
          {text.length} / {maxLength}
        </span>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <UsernameInput />
        <button
          type="submit"
          disabled={!text.trim()}
          className="w-full sm:w-auto px-8 py-3 bg-[var(--accent-color)] text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          Submit Definition
        </button>
      </div>
    </form>
  );
};

export default SubmissionForm;