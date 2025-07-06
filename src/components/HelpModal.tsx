import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '../components/ui/dialog';

interface HelpModalProps {
  isOpen: boolean;
  isOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, isOpenChange }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={isOpenChange}>
      <DialogContent className="w-full max-w-8xl rounded-2xl border-none p-0 overflow-hidden shadow-2xl">
        <div className="relative bg-white rounded-2xl p-6 max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">How to Play</h2>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto pr-2 custom-scroll flex-1 space-y-6 text-gray-700">
            <div>
              <h3 className="text-xl font-bold mb-2 text-blue-600">🎯 Objective</h3>
              <p>Guess the hidden word by clicking on letters from the alphabet grid!</p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2 text-green-600">📋 How to Play</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Each box represents one letter of the hidden word.</li>
                <li>Click on letters from the colorful grid below.</li>
                <li>Correct letters are revealed in the word.</li>
                <li>Wrong guesses reduce your remaining chances.</li>
                <li>You get 3 wrong guesses per word.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2 text-purple-600">⚡ Tips</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Start with vowels like A, E, I, O, U.</li>
                <li>Look for word patterns or themes.</li>
                <li>Use “Skip” if totally stuck.</li>
                <li>Have fun while learning!</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2 text-red-600">🏆 Scoring</h3>
              <p>Solve words correctly for points. Mistakes help you improve!</p>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-6 text-center">
            <Button
              onClick={() => isOpenChange(false)}
              className="relative inline-flex items-center justify-center px-8 py-6 text-lg font-bold text-white transition duration-300 ease-in-out bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 focus:outline-none"
            >
              <span className="relative z-10">🎮 Let’s Play</span>
              <span className="absolute inset-0 bg-white opacity-10 rounded-full blur-md"></span>
            </Button>

          </div>
        </div>
      </DialogContent>
    </Dialog>


  );
};

export default HelpModal;