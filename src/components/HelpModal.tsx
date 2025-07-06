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
      <DialogContent className="w-full max-w-2xl rounded-2xl border-none p-0 overflow-hidden shadow-2xl">
        <div className="relative bg-white rounded-2xl p-6 max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">How to Play</h2>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto pr-2 custom-scroll flex-1 space-y-6 text-gray-700">
            <div>
              <h3 className="text-lg font-bold mb-1 text-gray">1. Objective</h3>
              <p>Guess the hidden word by clicking on letters from the alphabet grid!</p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-1 text-gray">2. How to Play</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Each box represents one letter of the hidden word.</li>
                <li>Click on letters from the colorful grid below.</li>
                <li>Correct letters are revealed in the word.</li>
                <li>Wrong guesses reduce your remaining chances.</li>
                <li>You get 3 wrong guesses per word.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-1 text-gray">3. Tips</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Start with vowels like A, E, I, O, U.</li>
                <li>Look for word patterns or themes.</li>
                <li>Use “Skip” if totally stuck.</li>
                <li>Have fun while learning!</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-1 text-gray">4. Scoring</h3>
              <p>Solve words correctly for points. Mistakes help you improve!</p>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-6 text-center">
            <Button
              onClick={() => isOpenChange(false)}
              className="px-10 py-6 bg-black text-md font-bold text-white transition duration-300 ease-in-out rounded-md"
            >
              <span className="relative z-10">Let’s Play</span>
            </Button>

          </div>
        </div>
      </DialogContent>
    </Dialog>


  );
};

export default HelpModal;