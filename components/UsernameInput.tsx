import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../context/AppStateContext';

const UsernameInput: React.FC = () => {
  const { username, updateUsername } = useAppState();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(username);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(username);
  }, [username]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    updateUsername(name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };
  
  return (
    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
      <span>Submitting as:</span>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="font-bold bg-transparent text-gray-900 px-1 py-0 border-b-2 border-gray-300 focus:outline-none focus:border-[var(--accent-color)] transition-colors"
          maxLength={30}
        />
      ) : (
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-700">{username}</span>
          <button onClick={() => setIsEditing(true)} aria-label="Edit username" className="hover:text-[var(--accent-color)] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default UsernameInput;