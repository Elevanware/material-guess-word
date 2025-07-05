import React from 'react';
import { GuessResult } from '@/types/assessment';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

interface ResultsScreenProps {
  results: GuessResult[];
  onHome: () => void;
  onPlayAgain: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ results, onHome, onPlayAgain }) => {
  const completedWords = results.filter(r => r.completed).length;
  const totalWords = results.length;
  const totalWrongGuesses = results.reduce((sum, r) => sum + r.wrongGuesses, 0);
  const averageTime = results.reduce((sum, r) => sum + r.timeSpent, 0) / results.length / 1000;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-4xl w-full shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">🎉 Great Job! 🎉</h1>
          <p className="text-xl text-gray-600">Here are your results:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-100 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">{completedWords}</div>
            <div className="text-lg text-green-700">Words Completed</div>
            <div className="text-sm text-green-600">out of {totalWords}</div>
          </div>
          
          <div className="bg-red-100 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-red-600 mb-2">{totalWrongGuesses}</div>
            <div className="text-lg text-red-700">Wrong Guesses</div>
            <div className="text-sm text-red-600">total</div>
          </div>
          
          <div className="bg-blue-100 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{averageTime.toFixed(1)}s</div>
            <div className="text-lg text-blue-700">Average Time</div>
            <div className="text-sm text-blue-600">per word</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Word by Word Results:</h3>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={result.wordId} className="flex items-center justify-between bg-white rounded-lg p-4 shadow">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {result.completed ? '✅' : result.skipped ? '⏭️' : '❌'}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{result.word.toUpperCase()}</div>
                    <div className="text-sm text-gray-600">
                      {result.completed ? 'Completed' : result.skipped ? 'Skipped' : 'Incomplete'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    {result.wrongGuesses} wrong guesses
                  </div>
                  <div className="text-sm text-gray-600">
                    {(result.timeSpent / 1000).toFixed(1)}s
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button 
            onClick={onPlayAgain}
            className="bg-green-500 hover:bg-green-600 text-white text-xl px-8 py-4 rounded-full"
          >
            Play Again
          </Button>
          <Button 
            onClick={onHome}
            variant="outline"
            className="bg-white hover:bg-gray-50 text-gray-700 text-xl px-8 py-4 rounded-full border-2"
          >
            <Home className="mr-2 h-6 w-6" />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;