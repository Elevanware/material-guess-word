import React, { useState } from 'react';
import { AssessmentData, GuessResult } from '@/types/assessment';
import GuessTheWordHome from './GuessTheWordHome';
import GamePlay from './GamePlay';
import HelpModal from './HelpModal';
import ResultsScreen from './ResultScreen';

interface GuessTheWordAssessmentProps {
  assessment: AssessmentData;
  onComplete: () => void
}

type GameState = 'home' | 'playing' | 'results';

const GuessTheWordAssessment: React.FC<GuessTheWordAssessmentProps> = ({ assessment, onComplete }) => {
  const [gameState, setGameState] = useState<GameState>('home');
  const [showHelp, setShowHelp] = useState(false);
  const [results, setResults] = useState<GuessResult[]>([]);

  const handlePlay = () => {
    setGameState('playing');
  };

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
          theme={assessment.theme}
          animations={assessment.animations}
        />
      )}

      {gameState === 'playing' && (
        <GamePlay
          words={assessment.words}
          title={assessment.title}
          onHome={onComplete}
          onHelp={handleHelp}
          onComplete={handleComplete}
          theme={assessment.theme}
          animations={assessment.animations}
          gameConfig={assessment.gameConfig}
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