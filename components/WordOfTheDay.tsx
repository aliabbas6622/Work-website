import React from 'react';
import { DailyWord } from '../types';

interface WordOfTheDayProps {
  word: DailyWord;
}

const WordOfTheDay: React.FC<WordOfTheDayProps> = ({ word }) => {
  return (
    <div 
      className="relative p-2 rounded-3xl" 
      style={{ background: 'linear-gradient(135deg, #F3E8FF, #E0E7FF)' }}
    >
      <div 
        className="relative w-full h-80 rounded-2xl bg-cover bg-center flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: word.image ? `url(data:image/png;base64,${word.image})` : 'none', backgroundColor: '#D1D5DB' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent rounded-2xl"></div>
        <h1 className="relative text-7xl md:text-8xl font-extrabold text-white capitalize tracking-tighter" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
          {word.word}
        </h1>
      </div>
    </div>
  );
};

export default WordOfTheDay;