/* ---- Imports Section */
import React from 'react';
/* End ---- */

/* ---- Display game completion messgae */
interface GameCompleteProps {
  lives: number,
  resetGame: () => void
}

export const GameComplete = ({ lives, resetGame }: GameCompleteProps) => {
  return (
    <div className='gameComplete'>
      <div>
        <h2>{`Puzzle solved with ${lives} lives remaining`}</h2>
        <button type='button' className='button' onClick={resetGame}>Retry</button>
      </div>
    </div>
  );
}