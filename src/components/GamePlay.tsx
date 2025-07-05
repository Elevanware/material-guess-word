import React, { useState, useEffect } from 'react';
import { WordData, GuessResult } from '@/types/assessment';
import WordDisplay from './WordDisplay';
import AlphabetGrid from './AlphabetGrid';
import GameNavigation from './GameNavigation';
import { Button } from '@/components/ui/button';

const levelUpAudio = new Audio(`/sound/level-up.mp3`);
const failureAudio = new Audio(`/sound/failure.mp3`);

interface GamePlayProps {
  words: WordData[];
  title: string;
  onHome: () => void;
  onHelp: () => void;
  onComplete: (results: GuessResult[]) => void;
}

const GamePlay: React.FC<GamePlayProps> = ({ words, title, onHome, onHelp, onComplete }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [usedLetters, setUsedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [results, setResults] = useState<GuessResult[]>([]);

  const currentWord = words[currentWordIndex];
  const wordLetters = new Set(currentWord.word.toUpperCase().split(''));
  const isWordComplete = [...wordLetters].every(letter => guessedLetters.has(letter));

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentWordIndex]);

  const handleLetterClick = (letter: string) => {
    if (usedLetters.has(letter)) return;

    const newUsedLetters = new Set(usedLetters).add(letter);
    setUsedLetters(newUsedLetters);

    if (wordLetters.has(letter)) {
      levelUpAudio.play();
      setGuessedLetters(prev => new Set(prev).add(letter));
    } else {
      failureAudio.play();
      setWrongGuesses(prev => prev + 1);  
    }
  };

  const handleNext = () => {
    const timeSpent = Date.now() - startTime;
    const result: GuessResult = {
      wordId: currentWord.id,
      word: currentWord.word,
      completed: isWordComplete,
      wrongGuesses,
      skipped: !isWordComplete,
      timeSpent
    };

    const newResults = [...results, result];
    setResults(newResults);

    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setGuessedLetters(new Set());
      setUsedLetters(new Set());
      setWrongGuesses(0);
    } else {
      onComplete(newResults);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800">
      <GameNavigation
        onHome={onHome}
        onHelp={onHelp}
        onNext={handleNext}
        showNext={isWordComplete || wrongGuesses >= 5}
        currentWord={currentWordIndex + 1}
        totalWords={words.length}
      />
      
      <div className="pt-12 pb-8 px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">What's the word?</h2>
          <div className="text-2xl font-bold text-yellow-400 mb-8">{title}</div>
        </div>

        <WordDisplay 
          word={currentWord.word} 
          guessedLetters={guessedLetters} 
        />

        <AlphabetGrid 
          usedLetters={usedLetters}
          onLetterClick={handleLetterClick}
        />

        <div className="text-center mt-8">
          <div className="text-white text-lg mb-4">
            Wrong guesses: {wrongGuesses}/5
          </div>
          
          {wrongGuesses >= 5 && !isWordComplete && (
            <div className="mb-4">
              <p className="text-red-400 text-xl mb-4">Too many wrong guesses!</p>
              <p className="text-white text-lg">The word was: <span className="font-bold text-yellow-400">{currentWord.word.toUpperCase()}</span></p>
            </div>
          )}

          {isWordComplete && (
            <div className="mb-4">
              <p className="text-green-400 text-2xl font-bold animate-bounce">Correct! 🎉</p>
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <Button 
              onClick={handleSkip}
              variant="outline"
              className="bg-white hover:bg-gray-100 text-gray-700 px-6 py-3"
            >
              Skip Word
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlay;