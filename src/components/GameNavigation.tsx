import React, { useState } from 'react';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as Tooltip from '@radix-ui/react-tooltip';
import { WordData } from '@/types/assessment';

interface GameNavigationProps {
  onHome: () => void;
  currentWord: number;
  totalWords: number;
  hinttitle: string;
}

const GameNavigation: React.FC<GameNavigationProps> = ({
  onHome,
  currentWord,
  totalWords,
  hinttitle
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4 px-10">
      <div className="flex justify-between items-center w-full mx-auto">
        <div className="flex space-x-4">
          <Button
            onClick={onHome}
            variant="ghost"
            className="text-white hover:bg-slate-600 text-lg home-icon"
          >
            <img className='h-10' src='/images/home.png' />
          </Button>
          <Tooltip.Provider delayDuration={999999}>
            <Tooltip.Root open={open} onOpenChange={(state) => {
              // Prevent Radix from closing on blur/hover-out
             
              setOpen(state);
            }}>
              <Tooltip.Trigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-slate-600 text-lg hint-icon ml-10"
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
                  className="rounded bg-black text-white px-3 py-2 text-md shadow-md z-50"
                >
                  {hinttitle}
                  <Tooltip.Arrow className="fill-black" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>

        <p className="text-white text-lg font-bold letter-game-text">
          Word {currentWord} of {totalWords}
        </p>
      </div>
    </div>
  );
};

export default GameNavigation;