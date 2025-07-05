import React from 'react';

interface WordDisplayProps {
  word: string;
  guessedLetters: Set<string>;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ word, guessedLetters }) => {
  return (
    <div className="flex justify-center items-center space-x-3 mb-8">
      {word.split('').map((letter, index) => (
        <div
          key={index}
          className="w-16 h-16 border-4 border-black bg-white rounded-lg flex items-center justify-center shadow-lg"
        >
          <span className="text-3xl font-bold text-gray-800">
            {guessedLetters.has(letter.toUpperCase()) ? letter.toUpperCase() : ''}
          </span>
        </div>
      ))}
    </div>
  );
};

export default WordDisplay;