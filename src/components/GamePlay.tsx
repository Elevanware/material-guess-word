import React, { useState, useEffect } from 'react';
import { WordData, GuessResult, ThemeConfig, AnimationConfig, GameConfig } from '@/types/assessment';
import ConfettiExplosion from 'react-confetti-explosion';
import WordDisplay from './WordDisplay';
import AlphabetGrid from './AlphabetGrid';
import GameNavigation from './GameNavigation';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

interface GamePlayProps {
  words: WordData[];
  title: string;
  onHome: () => void;
  onHelp: () => void;
  onComplete: (results: GuessResult[]) => void;
  theme: ThemeConfig;
  animations: AnimationConfig;
  gameConfig: GameConfig;
}

const getAnimationClass = (animation: string, speed: 'slow' | 'medium' | 'fast') => {
  const speedClass = {
    slow: 'animate__slower',
    medium: '',
    fast: 'animate__faster'
  }[speed];

  const animationClass = {
    fade: 'animate__fadeIn',
    bounce: 'animate__bounceIn',
    slide: 'animate__slideInDown',
    flip: 'animate__flipInX'
  }[animation] || 'animate__fadeIn';

  return `animate__animated ${animationClass} ${speedClass}`;
};

const getCompletionAnimation = (animation: string) => {
  switch (animation) {
    case 'confetti':
      return <ConfettiExplosion particleCount={500} particleSize={8} duration={2500} />;
    case 'fireworks':
      return <ConfettiExplosion particleCount={200} particleSize={12} duration={3000} colors={['#FF0000', '#00FF00', '#0000FF']} />;
    case 'sparkle':
      return <ConfettiExplosion particleCount={100} particleSize={6} duration={2000} colors={['#FFD700', '#FFA500', '#FF69B4']} />;
    default:
      return <ConfettiExplosion particleCount={500} particleSize={8} duration={2500} />;
  }
};

const GamePlay: React.FC<GamePlayProps> = ({ 
  words, 
  title, 
  onHome, 
  onHelp, 
  onComplete,
  theme,
  animations,
  gameConfig 
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [usedLetters, setUsedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [results, setResults] = useState<GuessResult[]>([]);

  const currentWord = words[currentWordIndex];
  const wordLetters = new Set(currentWord.word.toUpperCase().split(''));
  const isWordComplete = [...wordLetters].every(letter => guessedLetters.has(letter));

  const levelUpAudio = new Audio(gameConfig.soundEffects.correctGuess);
  const failureAudio = new Audio(gameConfig.soundEffects.wrongGuess);
  const winAudio = new Audio(gameConfig.soundEffects.wordComplete);

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentWordIndex]);

  useEffect(() => {
    if (isWordComplete) {
      winAudio.play();
    }
  }, [isWordComplete]);

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

  const showNext = isWordComplete || wrongGuesses >= gameConfig.maxWrongGuesses;

  const containerStyle = {
    backgroundColor: theme.backgroundColor,
    backgroundImage: theme.backgroundImage ? `url(${theme.backgroundImage})` : undefined,
  };

  return (
    <div className="min-h-screen" style={containerStyle}>
      <GameNavigation
        onHome={onHome}
        currentWord={currentWordIndex + 1}
        totalWords={words.length}
        hinttitle={currentWord?.hint}
        theme={theme}
      />
      <div className='container mx-auto relative'>
        <div className='absolute r-10 desc-section'>
          <h2 style={{ color: theme.textColor }} className="text-sm">
            Wrong guesses: <span style={{ color: theme.accentColor }} className="font-bold ml-5">{wrongGuesses}/{gameConfig.maxWrongGuesses}</span>
          </h2>
          {wrongGuesses >= gameConfig.maxWrongGuesses && !isWordComplete && (
            <div className="mb-4">
              <p style={{ color: theme.textColor }} className="text-sm">
                The word was: <span style={{ color: theme.accentColor }} className="font-bold ml-5">{currentWord.word.toUpperCase()}</span>
              </p>
              <p style={{ color: theme.secondaryColor }} className="text-sm mb-0">Too many wrong guesses!</p>
            </div>
          )}
        </div>

        <div className="pt-2 pb-8 px-4">
          <div className="text-center mb-8">
            <h2 style={{ color: theme.textColor }} className="text-2xl mb-4 letter-game-text">What's the word?</h2>
            <div style={{ color: theme.primaryColor }} className="text-6xl font-bold mb-8 word-title">{title}</div>
          </div>

          <WordDisplay
            word={currentWord.word}
            guessedLetters={guessedLetters}
            isWordComplete={isWordComplete}
            theme={theme}
            animationClass={getAnimationClass(animations.alphabetAnimation, animations.transitionSpeed)}
          />

          <AlphabetGrid
            usedLetters={usedLetters}
            onLetterClick={handleLetterClick}
            theme={theme}
            animationClass={getAnimationClass(animations.alphabetAnimation, animations.transitionSpeed)}
          />

          {isWordComplete && (
            <div className="confetti confetti-wrapper absolute flex items-center justify-center z-10 winning-text">
              <p className={`text-4xl font-bold ${getAnimationClass(animations.wordCompleteAnimation, animations.transitionSpeed)}`}
                 style={{ color: theme.accentColor, backgroundColor: 'transparent' }}>
                {getCompletionAnimation(animations.wordCompleteAnimation)}
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
                <img className='h-40' src={gameConfig.navigationArrows.next} />
              </Button>
            ) : (
              <Button
                onClick={handleSkip}
                variant="outline"
                className='arrow-btn absolute border-0 -mt-15'
              >
                <img className='h-40' src={gameConfig.navigationArrows.skip} />
              </Button>
            )}
          </div>
        </div>
      </div>
      <div 
        onClick={onHelp}
        className="text-xl help-btn cursor-pointer"
        style={{ color: theme.secondaryColor }}
      >
        <HelpCircle className="mr-2 h-10 w-10" />
      </div>
    </div>
  );
};

export default GamePlay;