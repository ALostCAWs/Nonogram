/* ---- Imports Section */
import React from 'react';
/* End ---- */

/* ---- Display game over message */
interface GameOverProps {
  resetPuzzle: () => void
}

export const GameOver = ({ resetPuzzle }: GameOverProps) => {
  return (
    <div className='gameOver'>
      <div>
        <h2>Game Over</h2>
        <button type='button' className='button' onClick={resetPuzzle}>Retry</button>
      </div>
    </div>
  );
}