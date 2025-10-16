import React, { useMemo } from 'react';
import { useAppState } from '../context/AppStateContext';
import { Submission } from '../types';

const SubmissionCard: React.FC<{ submission: Submission; onLike: (id: string) => void; index: number; }> = ({ submission, onLike, index }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-start gap-4">
        <span className="font-bold text-lg text-gray-400 w-8 text-right flex-shrink-0 pt-0.5">{index}.</span>
        <div className="flex-grow">
            <p className="text-gray-800 break-words">{submission.text}</p>
            <p className="text-xs text-gray-500 mt-2">- {submission.username}</p>
        </div>
        <button 
            onClick={() => onLike(submission.id)}
            className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors flex-shrink-0"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold text-sm">{submission.likes}</span>
        </button>
    </div>
);


const LiveSubmissionsFeed: React.FC = () => {
  const { submissions, likeSubmission } = useAppState();

  const sortedSubmissions = useMemo(() => {
    return [...submissions].sort((a, b) => b.likes - a.likes);
  }, [submissions]);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Live Definitions</h2>
      {sortedSubmissions.length === 0 ? (
        <div className="text-center bg-gray-50 text-gray-500 p-8 rounded-lg border border-dashed border-gray-200">
          <p>Be the first to define this word!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedSubmissions.map((sub, index) => (
            <SubmissionCard key={sub.id} submission={sub} onLike={likeSubmission} index={index + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveSubmissionsFeed;