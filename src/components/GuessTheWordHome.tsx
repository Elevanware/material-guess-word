import React from 'react';
import { Play, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GuessTheWordHomeProps {
  onPlay: () => void;
  onHelp: () => void;
  title: string;
}

const GuessTheWordHome: React.FC<GuessTheWordHomeProps> = ({ onPlay, onHelp, title }) => {
  return (
    <div className="game-bg min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-4xl mx-auto w-full mt-40">
        <div className="relative bg-white rounded-3xl p-8 mb-12 shadow-2xl transform transition-transform duration-300 h-100 bg-main animate__animated animate__slideInDown">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center -mt-55">
              <img src='/images/Picture3.png' className='h-60' />
            </div>
          </div>
          
          <h1 className="text-7xl font-black text-gray-800 mx-auto word">
            What's The Word?
          </h1>
          <p className="text-2xl text-gray-600 mb-2 title">Interactive activity on Self Awareness</p>
          <p className="text-2xl text-gray-600 title">for Grades 2-3</p>
        </div>

        <div className="flex justify-center items-end space-x-8 mb-12 relative">
          <div className="game-img-left">
            <img className='h-80' src='/images/Picture2.png' />
          </div>

            <h2 onClick={onPlay} className="text-8xl font-black text-white mb-8 play-btn animate__backInDown">Play</h2>
          <div className="game-img-right">
            <img className='h-80' src='/images/Picture1.png' />
          </div>
        </div>

        <Button 
          onClick={onHelp}
          variant="outline"
          className="bg-white hover:bg-gray-50 text-gray-700 text-xl px-8 py-4 rounded-full shadow-lg border-2 border-gray-300 help-btn"
        >
          <HelpCircle className="mr-2 h-6 w-6" />
          Help
        </Button>
      </div>
    </div>
  );
};

export default GuessTheWordHome;