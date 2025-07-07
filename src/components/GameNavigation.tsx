import React, { useState } from 'react';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as Tooltip from '@radix-ui/react-tooltip';
import { WordData, ThemeConfig } from '@/types/assessment';

interface GameNavigationProps {
  onHome: () => void;
  currentWord: number;
  totalWords: number;
  hinttitle: string;
  theme: ThemeConfig;
}

const GameNavigation: React.FC<GameNavigationProps> = ({
  onHome,
  currentWord,
  totalWords,
  hinttitle,
  theme
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4 px-10" style={{ backgroundColor: theme.backgroundColor }}>
      <div className="flex justify-between items-center w-full mx-auto container">
        <div className="flex space-x-4">
          <Button
            onClick={onHome}
            variant="ghost"
            style={{ color: theme.textColor }}
            className="hover:bg-opacity-20 hover:bg-white text-lg home-icon"
          >
            <img className='h-10' src='/images/home.png' />
          </Button>
          <Tooltip.Provider delayDuration={999999}>
            <Tooltip.Root open={open} onOpenChange={(state) => {
              setOpen(state);
            }}>
              <Tooltip.Trigger asChild>
                <Button
                  variant="ghost"
                  style={{ color: theme.textColor }}
                  className="hover:bg-opacity-20 hover:bg-white text-lg hint-icon ml-10"
                  onClick={() => setOpen(prev => !prev)}
                >
                  <img
                    className="h-10"
                    src={`/images/${open ? "yellow-hint.png" : "white-hint.png"}`}
                    alt="Hint"
                  />
                </Button>
              </Tooltip.Trigger>

              <Tooltip.Portal>
                <Tooltip.Content
                  side="top"
                  sideOffset={8}
                  style={{
                    backgroundColor: theme.primaryColor,
                    color: theme.textColor
                  }}
                  className="rounded px-3 py-2 text-md shadow-md z-50"
                >
                  {hinttitle}
                  <Tooltip.Arrow style={{ fill: theme.primaryColor }} />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>

        <p style={{ color: theme.textColor }} className="text-lg font-bold letter-game-text">
          Word {currentWord} of {totalWords}
        </p>
      </div>
    </div>
  );
};

export default GameNavigation;