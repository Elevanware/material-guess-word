import React, { useState, useEffect } from 'react';
import 'animate.css';
import { ThemeConfig } from '@/types/assessment';

interface WordDisplayProps {
  word: string;
  guessedLetters: Set<string>;
  isWordComplete: boolean;
  theme: ThemeConfig;
  animationClass: string;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ 
  word, 
  guessedLetters, 
  isWordComplete,
  theme,
  animationClass 
}) => {
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

  return (
    <div className={`flex justify-center items-center space-x-3 mb-8 ${animationClass}`}>
      {word.split('').map((letter, index) => {
        const isRevealed = guessedLetters.has(letter.toUpperCase());

        return (
          <div
            key={index}
            style={{
              borderColor: theme.secondaryColor,
              backgroundColor: isRevealed && isWordComplete ? theme.primaryColor : 'transparent',
            }}
            className={`
               w-25 h-25 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300
              ${isRevealed 
                ? isWordComplete 
                  ? 'gradient-border' 
                  : 'border-4'
                : 'border-4'}
            `}
          >
            <span
              className={`
                text-7xl font-bold
                apha-letters
                ${isRevealed ? animationClass : ''}
              `}
              style={{
                color: isRevealed ? theme.accentColor : theme.textColor,
                opacity: isRevealed ? 1 : 0
              }}
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