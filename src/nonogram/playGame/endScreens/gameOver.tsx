/* ---- Imports Section */
import React from 'react';
/* End ---- */

/* ---- Display game over message */
interface GameOverProps {
  resetGame: () => void
}

export const GameOver = ({ resetGame }: GameOverProps) => {
  return (
    <div className='gameOver'>
      <div>
        <h2>Game Over</h2>
        <button type='button' className='button' onClick={resetGame}>Retry</button>
      </div>
    </div>
  );
}