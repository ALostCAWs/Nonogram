/* ---- Imports Section */
import React, { useEffect, useState } from 'react';
/* End ---- */

/* ---- Display game completion messgae */
export const GameComplete = ({ lives, resetGame }) => {
  return (
    <div className='gameComplete'>
      <h2>{`Puzzle solved with ${lives} lives remaining`}</h2>
      <button type='button' className='button' onClick={resetGame}>Retry</button>
    </div>
  );
}