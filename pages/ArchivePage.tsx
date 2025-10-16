
import React from 'react';
import { useAppState } from '../context/AppStateContext';
import ArchiveCard from '../components/ArchiveCard';
import AdPlaceholder from '../components/AdPlaceholder';

const ArchivePage: React.FC = () => {
  const { archive } = useAppState();

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-12 tracking-tight text-gray-800">
        Dream Archive
      </h1>
      
      {archive.length === 0 ? (
        <div className="text-center bg-gray-50 text-gray-500 p-8 rounded-lg flex flex-col items-center justify-center border border-gray-200">
            <svg className="w-24 h-24 mb-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            <h3 className="text-2xl font-semibold text-gray-700">The First Page is Unwritten</h3>
            <p className="mt-2 max-w-md">Past words and their meanings will be archived here. Complete a day to begin the collection!</p>
        </div>
      ) : (
        <div className="space-y-8">
          <AdPlaceholder />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {archive.map((item, index) => (
              <React.Fragment key={item.date + item.word}>
                <ArchiveCard archivedWord={item} />
                {(index + 1) % 4 === 0 && index < archive.length -1 && (
                   <div className="md:col-span-2">
                       <AdPlaceholder />
                   </div>
                )}
              </React.Fragment>
            ))}
          </div>
          {archive.length > 5 && <AdPlaceholder />}
        </div>
      )}
    </div>
  );
};

export default ArchivePage;