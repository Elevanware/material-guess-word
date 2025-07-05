import React from 'react';
import { Home, HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameNavigationProps {
  onHome: () => void;
  onHelp: () => void;
  onNext: () => void;
  showNext: boolean;
  currentWord: number;
  totalWords: number;
}

const GameNavigation: React.FC<GameNavigationProps> = ({ 
  onHome, 
  onHelp, 
  onNext, 
  showNext, 
  currentWord, 
  totalWords 
}) => {
  return (
    <div className="bg-slate-700 border-b-4 border-slate-800 p-4">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex space-x-4">
          <Button 
            onClick={onHome}
            variant="ghost" 
            className="text-white hover:bg-slate-600 text-lg px-6 py-3"
          >
            <Home className="mr-2 h-5 w-5" />
            Home
          </Button>
          <Button 
            onClick={onHelp}
            variant="ghost" 
            className="text-white hover:bg-slate-600 text-lg px-6 py-3"
          >
            <HelpCircle className="mr-2 h-5 w-5" />
            Help
          </Button>
        </div>
        
        <div className="text-white text-lg font-bold">
          Word {currentWord} of {totalWords}
        </div>
        
        <Button 
          onClick={onNext}
          variant={showNext ? "default" : "ghost"}
          className={`text-lg px-6 py-3 ${
            showNext 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'text-gray-400 cursor-not-allowed'
          }`}
          disabled={!showNext}
        >
          <ArrowRight className="mr-2 h-5 w-5" />
          Next
        </Button>
      </div>
    </div>
  );
};

export default GameNavigation;