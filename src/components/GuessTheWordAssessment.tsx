import React, { useState, useCallback } from 'react';
import { AssessmentData, GuessResult, GuessTheWordAssessment as GuessTheWordAssessmentType } from '@/types/assessment';
import GuessTheWordHome from './GuessTheWordHome';
import GamePlay from './GamePlay';
import HelpModal from './HelpModal';
import ResultsScreen from './ResultScreen';
import { useNavigate } from 'react-router-dom';

interface GuessTheWordAssessmentProps {
  assessment: GuessTheWordAssessmentType;
  onComplete: () => void
}

type GameState = 'home' | 'playing' | 'results';

const GuessTheWordAssessment: React.FC<GuessTheWordAssessmentProps> = ({ assessment, onComplete }) => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>('home');
  const [showHelp, setShowHelp] = useState(false);
  const [results, setResults] = useState<GuessResult[]>([]);

  const handlePlay = () => {
    setGameState('playing');
  };

  const handleHome = useCallback(() => {
    if (gameState === 'results') {
      navigate('/'); // Return to assessment list
    } else {
      setGameState('home');
      setResults([]);
    }
  }, [gameState, navigate]);

  const handleHelp = () => {
    setShowHelp(true);
  };

  const handleComplete = (gameResults: GuessResult[]) => {
    setResults(gameResults);
    setGameState('results');
  };

  const handlePlayAgain = () => {
    setResults([]);
    setGameState('playing');
  };

  return (
    <div>
      {gameState === 'home' && (
        <GuessTheWordHome 
          onPlay={handlePlay}
          onHelp={handleHelp}
          title={assessment.title}
        />
      )}

      {gameState === 'playing' && (
        <GamePlay
          words={assessment.words}
          title={assessment.title}
          onHome={onComplete}
          onHelp={handleHelp}
          onComplete={handleComplete}
        />
      )}

      {gameState === 'results' && (
        <ResultsScreen
          results={results}
          onHome={onComplete}
          onPlayAgain={handlePlayAgain}
        />
      )}

      <HelpModal 
        isOpen={showHelp}
        isOpenChange={setShowHelp}
      />
    </div>
  );
};

export default GuessTheWordAssessment;