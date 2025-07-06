import React, { useState, useEffect, useRef } from 'react';
import { ImagePuzzleAssessment, PuzzleResult } from '@/types/assessment';
import { Card } from '@/components/ui/card';
import confetti from 'canvas-confetti';
import { splitImage } from '@/lib/image-utils';

interface ImagePuzzleGameProps {
  assessment: ImagePuzzleAssessment;
  onComplete: (result: PuzzleResult) => void;
}

const ImagePuzzleGame: React.FC<ImagePuzzleGameProps> = ({ assessment, onComplete }) => {
  const [currentOrder, setCurrentOrder] = useState<number[]>([]);
  const [pieces, setPieces] = useState([]);
  const [startTime] = useState<number>(Date.now());
  const [moves, setMoves] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const successAudioRef = useRef<HTMLAudioElement | null>(null);

  const generatePuzzlePieces = async() => {
    console.log("asss", assessment)
      const pieces = await splitImage(assessment.puzzle.finalImageUrl, assessment.puzzle.rows, assessment.puzzle.cols);
      setPieces(pieces);
      const totalPieces = assessment.puzzle.rows * assessment.puzzle.cols;
      const correctOrder = Array.from({ length: totalPieces }, (_, index) => index);
      const shuffledOrder = [...correctOrder]
      .sort(() => Math.random() - 0.5);
    setCurrentOrder(shuffledOrder);
      return { pieces, correctOrder };
  };

  useEffect(() => {
    // Initialize puzzle pieces in random order
    generatePuzzlePieces().then(()=>{
      successAudioRef.current = new Audio('/sound/level-up.mp3');
    })
  }, [assessment]);

  const handleDragStart = (position: number) => {
    dragItem.current = position;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (position: number) => {
    dragOverItem.current = position;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragItem.current === null || dragOverItem.current === null) return;

    const newOrder = [...currentOrder];
    const draggedItem = newOrder[dragItem.current];
    newOrder[dragItem.current] = newOrder[dragOverItem.current];
    newOrder[dragOverItem.current] = draggedItem;

    setCurrentOrder(newOrder);
    setMoves(prev => prev + 1);

    // Check if puzzle is solved
    const isCorrect = newOrder.every((piece, index) => piece === Array.from({ length: assessment.puzzle.rows * assessment.puzzle.cols }, (_, index) => index)[index]);
    if (isCorrect && !isComplete) {
      handlePuzzleComplete();
    }
  };

  const handlePuzzleComplete = () => {
    setIsComplete(true);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    // Play success sound
    if (successAudioRef.current) {
      successAudioRef.current.play();
    }

    // Show confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    onComplete({
      completed: true,
      timeSpent,
      moves
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{assessment.title}</h2>
            <p className="text-gray-600">
              Drag and drop the pieces to complete the puzzle!
            </p>
          </div>

          {/* Final image preview */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Final Image:</h3>
            <img 
              src={assessment.puzzle.finalImageUrl} 
              alt="Final puzzle"
              className="w-48 h-48 object-cover rounded-lg mx-auto border-2 border-gray-200"
            />
          </div>

          {/* Puzzle grid */}
          <div 
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${assessment.puzzle.cols}, 1fr)`,
              maxWidth: '600px',
              margin: '0 auto',
              backgroundColor: '#000',
              padding: '1px'
            }}
          >
            {currentOrder.map((pieceIndex, position) => {
              const piece = pieces[pieceIndex];
              return (
                <div
                  key={piece.index}
                  draggable
                  onDragStart={() => handleDragStart(position)}
                  onDragOver={handleDragOver}
                  onDragEnter={() => handleDragEnter(position)}
                  onDrop={handleDrop}
                  className={`
                    aspect-square cursor-move relative
                    ${isComplete ? 'outline outline-1 outline-green-500' : ''}
                  `}
                  style={{ padding: '0.5px' }}
                >
                  <img
                    src={piece.url}
                    alt={`Puzzle piece ${position + 1}`}
                    className="w-full h-full object-cover"
                    style={{ 
                      imageRendering: 'pixelated',
                      backfaceVisibility: 'hidden'
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Game stats */}
          <div className="mt-6 flex justify-center gap-8 text-center">
            <div>
              <p className="text-gray-600">Moves</p>
              <p className="text-2xl font-bold">{moves}</p>
            </div>
            <div>
              <p className="text-gray-600">Time</p>
              <p className="text-2xl font-bold">
                {Math.floor((Date.now() - startTime) / 1000)}s
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ImagePuzzleGame;