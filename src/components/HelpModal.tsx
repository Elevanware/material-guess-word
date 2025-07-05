import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">How to Play</h2>
          <Button 
            onClick={onClose}
            variant="ghost"
            className="p-2"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="space-y-6 text-gray-700">
          <div>
            <h3 className="text-xl font-bold mb-2 text-blue-600">🎯 Objective</h3>
            <p>Guess the hidden word by clicking on letters from the alphabet grid!</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-2 text-green-600">📋 How to Play</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Look at the empty boxes - each box represents one letter</li>
              <li>Click on letters from the colorful alphabet grid</li>
              <li>If the letter is in the word, it will appear in the correct position</li>
              <li>If the letter is not in the word, it counts as a wrong guess</li>
              <li>You can make up to 3 wrong guesses per word</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-2 text-purple-600">⚡ Tips</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Start with common letters like A, E, I, O, U</li>
              <li>Think about what words might fit the theme</li>
              <li>Use the "Skip Word" button if you're stuck</li>
              <li>Try your best - learning is the goal!</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-2 text-red-600">🏆 Scoring</h3>
            <p>Complete words correctly to get the best score. Don't worry about mistakes - they help you learn!</p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Button 
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg"
          >
            Got it! Let's Play
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;