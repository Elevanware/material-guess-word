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
        {/* Main Title Speech Bubble */}
        <div className="relative bg-white rounded-3xl p-8 mb-12 shadow-2xl transform hover:scale-105 transition-transform duration-300 h-100 bg-main">
          {/* <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rotate-45"></div> */}
          
          {/* Reading Character */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center -mt-55">
              <img src='/images/Picture3.png' className='h-60' />
            </div>
          </div>
          
          <h1 className="text-7xl font-black text-gray-800 mx-auto word">
            What's The Word?
          </h1>
          {/* <h4 className="text-2xl font-black">{title}</h4> */}
          <p className="text-2xl text-gray-600 mb-2 title">Interactive activity on Self Awareness</p>
          <p className="text-2xl text-gray-600 title">for Grades 2-3</p>
        </div>

        {/* Character Row */}
        <div className="flex justify-center items-end space-x-8 mb-12 relative">
          {/* Happy Yellow Character */}
          <div className="game-img-left">
            <img className='h-80' src='/images/Picture2.png' />
          </div>

          {/* Play Button */}
          {/* <div className="bg-white rounded-full p-4 shadow-xl"> */}
            <h2 onClick={onPlay} className="text-8xl font-black text-white mb-8 play-btn animate__backInDown">Play</h2>
          {/* </div> */}

          {/* Sad Pink Character */}
          <div className="game-img-right">
            <img className='h-80' src='/images/Picture1.png' />
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

        {/* Question Mark Decorations */}
        <div className="absolute top-10 left-10 w-14 h-14 bg-white rounded-full flex items-center justify-center text-red-500 text-2xl font-bold animate-bounce">
          ?
        </div>
        <div className="absolute top-10 right-10 w-14 h-14 bg-cyan-400 rounded-full flex items-center justify-center text-white text-xl font-bold animate-bounce delay-500">
          ?
        </div>
        <div className="absolute bottom-15 right-10 w-14 h-14 bg-purple-400 rounded-full flex items-center justify-center text-white text-xl font-bold animate-bounce delay-1000">
          ?
        </div>
        <div className="absolute bottom-15 left-10 w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-white text-xl font-bold animate-bounce delay-1000">
          ?
        </div>
      </div>
    </div>
  );
};

export default GuessTheWordHome;