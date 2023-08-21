/* ---- Imports Section */
import React, { useEffect, useState } from 'react';
/* End ---- */

/* ---- Display game over message */
export const GameOver = ({ resetGame }) => {
  return (
    <div className='gameOver'>
      <div>
        <h2>Game Over</h2>
        <button type='button' className='button' onClick={resetGame}>Retry</button>
      </div>
    </div>
  );
}