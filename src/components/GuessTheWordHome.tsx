import React from 'react';
import { Play, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GuessTheWordHomeProps {
  onPlay: () => void;
  onHelp: () => void;
}

const GuessTheWordHome: React.FC<GuessTheWordHomeProps> = ({ onPlay, onHelp }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 flex items-center justify-center p-4">
      <div className="text-center max-w-4xl mx-auto">
        {/* Main Title Speech Bubble */}
        <div className="relative bg-white rounded-3xl p-8 mb-12 shadow-2xl transform hover:scale-105 transition-transform duration-300">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rotate-45"></div>
          
          {/* Reading Character */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-red-400 rounded-full flex items-center justify-center animate-bounce">
              <div className="text-black text-xl">📚</div>
            </div>
          </div>
          
          <h1 className="text-5xl font-black text-gray-800 mb-4">
            What's The Word?
          </h1>
          <p className="text-xl text-gray-600 mb-2">Interactive activity on Self Awareness</p>
          <p className="text-lg text-gray-500">for Grades 2-3</p>
        </div>

        {/* Character Row */}
        <div className="flex justify-center items-end space-x-8 mb-12">
          {/* Happy Yellow Character */}
          <div className="flex flex-col items-center animate-pulse">
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mb-2 hover:scale-110 transition-transform">
              <div className="text-2xl">😄</div>
            </div>
            <div className="w-8 h-16 bg-yellow-400 rounded-b-full"></div>
            <div className="flex space-x-2 mt-1">
              <div className="w-3 h-8 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-8 bg-yellow-400 rounded-full"></div>
            </div>
          </div>

          {/* Play Button */}
          <div className="bg-white rounded-full p-4 shadow-xl">
            <h2 className="text-6xl font-black text-gray-800 mb-8">PLAY</h2>
            <Button 
              onClick={onPlay}
              className="bg-green-500 hover:bg-green-600 text-white text-2xl px-12 py-6 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200"
            >
              <Play className="mr-3 h-8 w-8" />
              START
            </Button>
          </div>

          {/* Sad Pink Character */}
          <div className="flex flex-col items-center animate-pulse delay-300">
            <div className="w-20 h-20 bg-pink-400 rounded-full flex items-center justify-center mb-2 hover:scale-110 transition-transform">
              <div className="text-2xl">😔</div>
            </div>
            <div className="w-8 h-16 bg-pink-400 rounded-b-full"></div>
            <div className="flex space-x-2 mt-1">
              <div className="w-3 h-8 bg-pink-400 rounded-full"></div>
              <div className="w-3 h-8 bg-pink-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Help Button */}
        <Button 
          onClick={onHelp}
          variant="outline"
          className="bg-white hover:bg-gray-50 text-gray-700 text-xl px-8 py-4 rounded-full shadow-lg border-2 border-gray-300"
        >
          <HelpCircle className="mr-2 h-6 w-6" />
          Help
        </Button>

        {/* Question Mark Decorations */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-white rounded-full flex items-center justify-center text-red-500 text-2xl font-bold animate-bounce">
          ?
        </div>
        <div className="absolute top-20 right-20 w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center text-white text-xl font-bold animate-bounce delay-500">
          ?
        </div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-purple-400 rounded-full flex items-center justify-center text-white text-xl font-bold animate-bounce delay-1000">
          ?
        </div>
      </div>
    </div>
  );
};

export default GuessTheWordHome;