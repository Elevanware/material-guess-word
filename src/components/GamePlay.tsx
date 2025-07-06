import React, { useState, useEffect } from 'react';
import { WordData, GuessResult } from '@/types/assessment';
import ConfettiExplosion from 'react-confetti-explosion';
import WordDisplay from './WordDisplay';
import AlphabetGrid from './AlphabetGrid';
import GameNavigation from './GameNavigation';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

const levelUpAudio = new Audio(`/sound/level-up.mp3`);
const failureAudio = new Audio(`/sound/failure.mp3`);
const winAudio = new Audio(`/sound/winSound.aac`);
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
  if (isWordComplete) {
    winAudio.play();
  }

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

  const showNext = isWordComplete || wrongGuesses >= 5

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 home-page">
      <GameNavigation
        onHome={onHome}
        // onNext={handleNext}
        // showNext={isWordComplete || wrongGuesses >= 5}
        currentWord={currentWordIndex + 1}
        totalWords={words.length}
        hinttitle={currentWord?.hint}
      />
      <div className='container mx-auto relative'>
        <div className='absolute r-10 desc-section'>
          <h2 className="text-white text-sm">
            Wrong guesses: <span className="font-bold text-yellow-400 ml-5">{wrongGuesses}/5</span>
          </h2>
          {wrongGuesses >= 5 && !isWordComplete && (
            <div className="mb-4">
              <p className="text-white text-sm">The word was: <span className="font-bold text-yellow-400 ml-5">{currentWord.word.toUpperCase()}</span></p>
              <p className="text-red-400 text-sm mb-0">Too many wrong guesses!</p>
            </div>
          )}
        </div>

        <div className="pt-2 pb-8 px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl text-white mb-4 letter-game-text">What's the word?</h2>
            <div className="text-6xl font-bold text-yellow-400 mb-8 word-title">{title}</div>
          </div>

          <WordDisplay
            word={currentWord.word}
            guessedLetters={guessedLetters}
            isWordComplete={isWordComplete}
          />

          <AlphabetGrid
            usedLetters={usedLetters}
            onLetterClick={handleLetterClick}
          />

          {isWordComplete && (
            <div className="confetti confetti-wrapper absolute flex items-center justify-center z-10 winning-text">
              <p className="confetti text-green-400 text-4xl font-bold animate__animated animate__heartBeat bg-transparent bg-opacity-80 px-6 py-4 rounded-lg shadow-xl">
                <ConfettiExplosion particleCount={500} particleSize={8} duration={2500} />
              </p>
            </div>
          )}

          <div className="flex justify-center space-x-4 relative max-w-7xl mx-auto">
            {isWordComplete ? (
              <Button
                onClick={handleNext}
                variant={showNext ? "default" : "ghost"}
                disabled={!showNext}
                className='arrow-btn absolute border-0 -mt-15'
              >
                <img className='h-40' src='/images/green-arrow.png' />
              </Button>
            ) : (
              <Button
                onClick={handleSkip}
                variant="outline"
                className='arrow-btn absolute border-0 -mt-15'
              >
                <img className='h-40' src='/images/orange-arrow.png' />
              </Button>
            )}


          </div>
        </div>
      </div>
       {/* Help Button */}
        <Button 
          onClick={onHelp}
          variant="outline"
          className="bg-white hover:bg-gray-50 text-gray-700 text-xl px-8 py-4 rounded-full shadow-lg border-2 border-gray-300 help-btn"
        >
          <HelpCircle className="mr-2 h-6 w-6" />
          Help
        </Button>
    </div>
  );
};

export default GamePlay;