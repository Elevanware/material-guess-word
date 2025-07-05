import React from 'react';

interface AlphabetGridProps {
  usedLetters: Set<string>;
  onLetterClick: (letter: string) => void;
}

const AlphabetGrid: React.FC<AlphabetGridProps> = ({ usedLetters, onLetterClick }) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  const getLetterColor = (index: number) => {
    const colors = [
      'bg-green-400', 'bg-cyan-400', 'bg-purple-400', 'bg-red-400', 'bg-yellow-400', 
      'bg-orange-400', 'bg-pink-400', 'bg-blue-400', 'bg-indigo-400', 'bg-teal-400',
      'bg-lime-400', 'bg-rose-400', 'bg-amber-400', 'bg-emerald-400', 'bg-violet-400',
      'bg-sky-400', 'bg-fuchsia-400', 'bg-green-500', 'bg-cyan-500', 'bg-purple-500',
      'bg-red-500', 'bg-yellow-500', 'bg-orange-500', 'bg-pink-500', 'bg-blue-500', 'bg-indigo-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="grid grid-cols-7 gap-4 max-w-2xl mx-auto p-4">
      {alphabet.map((letter, index) => (
        <button
          key={letter}
          onClick={() => onLetterClick(letter)}
          disabled={usedLetters.has(letter)}
          className={`
            w-16 h-16 rounded-xl text-white text-2xl font-bold border-4 border-black
            transform transition-all duration-200 shadow-lg
            ${usedLetters.has(letter) 
              ? 'opacity-0 scale-0 cursor-not-allowed' 
              : `${getLetterColor(index)} hover:scale-110 hover:shadow-xl active:scale-95 cursor-pointer`
            }
          `}
        >
          {!usedLetters.has(letter) && letter}
        </button>
      ))}
    </div>
  );
};

export default AlphabetGrid;