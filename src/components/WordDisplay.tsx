import React, { useState, useEffect } from 'react';
import 'animate.css';

interface WordDisplayProps {
  word: string;
  guessedLetters: Set<string>;
  isWordComplete: boolean
}

const WordDisplay: React.FC<WordDisplayProps> = ({ word, guessedLetters, isWordComplete }) => {
  const [revealedLetters, setRevealedLetters] = useState<{ [index: number]: boolean }>({});

  useEffect(() => {
    const newRevealed: { [index: number]: boolean } = {};
    word.split('').forEach((letter, i) => {
      if (guessedLetters.has(letter.toUpperCase()) && !revealedLetters[i]) {
        newRevealed[i] = true;
      }
    });
    if (Object.keys(newRevealed).length > 0) {
      setRevealedLetters(prev => ({ ...prev, ...newRevealed }));
    }
  }, [guessedLetters, word, revealedLetters]);

  const getLetterColor = (letter: string) => {
    const index = letter.charCodeAt(0) - 65; // A-Z
    const colors = [
      'text-green-500', 'text-cyan-500', 'text-purple-500', 'text-red-500', 'text-yellow-500',
      'text-orange-500', 'text-pink-500', 'text-blue-500', 'text-indigo-500', 'text-teal-500',
      'text-lime-500', 'text-rose-500', 'text-amber-500', 'text-emerald-500', 'text-violet-500',
      'text-sky-500', 'text-fuchsia-500', 'text-green-600', 'text-cyan-600', 'text-purple-600',
      'text-red-600', 'text-yellow-600', 'text-orange-600', 'text-pink-600', 'text-blue-600', 'text-indigo-600'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="flex justify-center items-center space-x-3 mb-8">
      {word.split('').map((letter, index) => {
        const isRevealed = guessedLetters.has(letter.toUpperCase());
        const letterColor = getLetterColor(letter.toUpperCase());

        return (
          // <div
          //   key={index}
          //   className="border-4 w-25 h-25 px-5 py-3 border-white bg-transparent rounded-lg flex items-center justify-center shadow-lg"
          // >
          <div
            key={index}
            className={`
               w-25 h-25 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300
              ${isRevealed 
                ? isWordComplete 
                  ? 'bg-black gradient-border' // custom class
                  : 'bg-transparent border-4 border-white'
                : 'border-4 border-white'}
            `}
          >

            <span
              className={`
                text-7xl font-bold
                apha-letters
                ${isRevealed ? `animate__animated animate__zoomIn ${letterColor}` : 'text-gray-800'}
              `}
            >
              {isRevealed ? letter.toUpperCase() : ''}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default WordDisplay;
