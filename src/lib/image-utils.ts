interface ImagePiece {
  url: string;
  index: number;
}

const TAB_SIZE = 0.12; // Size of puzzle tabs relative to piece size

// Helper function to create puzzle piece path with perfect interlocking
const createPuzzlePath = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  hasRightTab: boolean,
  hasBottomTab: boolean,
  isRightEdge: boolean,
  isBottomEdge: boolean
) => {
  const tabSize = Math.min(w, h) * TAB_SIZE;
  
  ctx.beginPath();
  ctx.moveTo(x, y);

  // Top edge
  ctx.lineTo(x + w, y);

  // Right edge with tab/slot
  if (!isRightEdge) {
    if (hasRightTab) {
      ctx.lineTo(x + w, y + h/3);
      ctx.bezierCurveTo(
        x + w + tabSize, y + h/3,
        x + w + tabSize, y + h * 2/3,
        x + w, y + h * 2/3
      );
    } else {
      ctx.lineTo(x + w, y + h/3);
      ctx.bezierCurveTo(
        x + w - tabSize, y + h/3,
        x + w - tabSize, y + h * 2/3,
        x + w, y + h * 2/3
      );
    }
  }
  ctx.lineTo(x + w, y + h);

  // Bottom edge with tab/slot
  if (!isBottomEdge) {
    if (hasBottomTab) {
      ctx.lineTo(x + w * 2/3, y + h);
      ctx.bezierCurveTo(
        x + w * 2/3, y + h + tabSize,
        x + w/3, y + h + tabSize,
        x + w/3, y + h
      );
    } else {
      ctx.lineTo(x + w * 2/3, y + h);
      ctx.bezierCurveTo(
        x + w * 2/3, y + h - tabSize,
        x + w/3, y + h - tabSize,
        x + w/3, y + h
      );
    }
  }
  ctx.lineTo(x, y + h);

  // Left edge (straight)
  ctx.lineTo(x, y);
  
  ctx.closePath();
};

export const splitImage = async (
  imageUrl: string,
  rows: number,
  cols: number
): Promise<ImagePiece[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const pieces: ImagePiece[] = [];
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      const pieceWidth = img.width / cols;
      const pieceHeight = img.height / rows;
      const padding = Math.min(pieceWidth, pieceHeight) * 0.05; // 5% padding for minimal gaps
      
      // Set canvas size to piece dimensions plus minimal padding
      canvas.width = pieceWidth + padding * 2;
      canvas.height = pieceHeight + padding * 2;

      // Create a consistent pattern for piece tabs
      const tabPattern: boolean[][] = Array(rows).fill(0).map(() => 
        Array(cols).fill(0).map(() => Math.random() > 0.5)
      );

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Clear canvas for new piece
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Set up piece styles without shadows for cleaner edges
          ctx.fillStyle = '#fff';
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 0.5; // Thinner border for tighter fit

          // Create puzzle piece path
          createPuzzlePath(
            ctx,
            padding,
            padding,
            pieceWidth,
            pieceHeight,
            tabPattern[row][col],
            row < rows - 1 ? tabPattern[row + 1][col] : false,
            col === cols - 1,
            row === rows - 1
          );

          // Create clipping path for the image
          ctx.save();
          ctx.clip();

          // Draw the section of the image for this piece
          ctx.drawImage(
            img,
            col * pieceWidth,
            row * pieceHeight,
            pieceWidth,
            pieceHeight,
            padding,
            padding,
            pieceWidth,
            pieceHeight
          );

          ctx.restore();

          // Add subtle border to piece
          ctx.stroke();

          // Convert to data URL
          const pieceUrl = canvas.toDataURL('image/png');
          const index = row * cols + col;
          
          pieces.push({
            url: pieceUrl,
            index
          });
        }
      }

      resolve(pieces);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
};