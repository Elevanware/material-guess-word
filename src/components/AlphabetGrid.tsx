import React, { useState } from 'react';
import 'animate.css';
import { ThemeConfig } from '@/types/assessment';

interface AlphabetGridProps {
  usedLetters: Set<string>;
  theme: ThemeConfig;
  animationClass: string;
  onLetterClick: (letter: string) => void;
}

const AlphabetGrid: React.FC<AlphabetGridProps> = ({ usedLetters, onLetterClick }) => {
  const [animatingLetter, setAnimatingLetter] = useState<string | null>(null);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const getLetterColor = (index: number) => {
    const colors = [
      'text-green-500', 'text-cyan-500', 'text-purple-500', 'text-red-500', 'text-yellow-500',
      'text-orange-500', 'text-pink-500', 'text-blue-500', 'text-indigo-500', 'text-teal-500',
      'text-lime-500', 'text-rose-500', 'text-amber-500', 'text-emerald-500', 'text-violet-500',
      'text-sky-500', 'text-fuchsia-500', 'text-green-600', 'text-cyan-600', 'text-purple-600',
      'text-red-600', 'text-yellow-600', 'text-orange-600', 'text-pink-600', 'text-blue-600', 'text-indigo-600'
    ];
    return colors[index % colors.length];
  };

  const handleClick = (letter: string) => {
    setAnimatingLetter(letter);
    setTimeout(() => {
      onLetterClick(letter);         // trigger main logic
      setAnimatingLetter(null);     // reset animation state
    }, 200); // match animation duration
  };

  return (
    <div className="grid grid-cols-7 gap-4 w-5xl mx-auto p-4 alpha-box">
      {alphabet.map((letter, index) => {
        const isUsed = usedLetters.has(letter);
        const isAnimating = animatingLetter === letter;

        return (
          <button
            key={letter}
            onClick={() => handleClick(letter)}
            disabled={isUsed || isAnimating}
            className={`
              apha-letters text-7xl font-bold transform transition-all duration-200 shadow-lg
              ${isUsed ? 'opacity-0 scale-0 cursor-not-allowed' : ''}
              ${!isUsed && getLetterColor(index)}
              ${isAnimating ? 'animate__animated animate__zoomOut' : 'active:scale-95 cursor-pointer'}
            `}
          >
            {!isUsed && letter}
          </button>
        );
      })}
    </div>
  );
};

export default AlphabetGrid;
