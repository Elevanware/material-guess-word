import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeConfig, AnimationConfig } from '@/types/assessment';

interface GuessTheWordHomeProps {
  onPlay: () => void;
  onHelp: () => void;
  title: string;
  theme: ThemeConfig;
  animations: AnimationConfig;
}

const getAnimationClass = (animation: string, speed: 'slow' | 'medium' | 'fast') => {
  const speedClass = {
    slow: 'animate__slower',
    medium: '',
    fast: 'animate__faster'
  }[speed];

  const animationClass = {
    fade: 'animate__fadeIn',
    bounce: 'animate__bounceIn',
    slide: 'animate__slideInDown',
    flip: 'animate__flipInX'
  }[animation] || 'animate__fadeIn';

  return `animate__animated ${animationClass} ${speedClass}`;
};

const GuessTheWordHome: React.FC<GuessTheWordHomeProps> = ({ 
  onPlay, 
  onHelp, 
  title,
  theme,
  animations 
}) => {
  const containerStyle = {
    backgroundColor: theme.backgroundColor,
    backgroundImage: theme.backgroundImage ? `url(${theme.backgroundImage})` : `url(./images/alpha-bg.jpg)`,
    color: theme.textColor,
  };

  const cardStyle = {
    backgroundColor: theme.primaryColor,
    color: theme.textColor,
  };

  const titleStyle = {
    color: theme.accentColor,
  };

  const subtitleStyle = {
    color: theme.secondaryColor,
  };

  return (
    <div className="game-bg min-h-screen flex items-center justify-center p-4" style={containerStyle}>
      <div className="text-center max-w-4xl mx-auto w-full mt-40">
        <div 
          className={`relative rounded-3xl p-8 mb-12 shadow-2xl transform transition-transform duration-300 h-100 ${getAnimationClass(animations.alphabetAnimation, animations.transitionSpeed)}`}
          style={cardStyle}
        >
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center -mt-55">
              <img src='/images/Picture3.png' className='h-60' />
            </div>
          </div>

          <h1 
            className="text-7xl font-black mx-auto word"
            style={titleStyle}
          >
            What's The Word?
          </h1>
          <p 
            className="text-2xl mb-2 title"
            style={subtitleStyle}
          >
            Interactive activity on Self Awareness
          </p>
          <p 
            className="text-2xl title"
            style={subtitleStyle}
          >
            for Grades 2-3
          </p>
        </div>

        <div className="flex justify-center items-end space-x-8 mb-12 relative">
          <div className="game-img-left">
            <img className='h-80' src='/images/Picture2.png' />
          </div>

          <h2 
            onClick={onPlay} 
            className={`text-8xl font-black mb-8 play-btn cursor-pointer ${getAnimationClass(animations.alphabetAnimation, animations.transitionSpeed)}`}
            style={{ color: theme.accentColor }}
          >
            Play
          </h2>
          
          <div className="game-img-right">
            <img className='h-80' src='/images/Picture1.png' />
          </div>
        </div>

        <div
          onClick={onHelp}
          className="text-xl help-btn cursor-pointer"
          style={{ color: theme.secondaryColor }}
        >
          <HelpCircle className="mr-2 h-10 w-10" />
        </div>
      </div>
    </div>
  );
};

export default GuessTheWordHome;