/* ---- Imports Section */
import React, { useEffect, useState } from 'react';
/* End ---- */

export const GameOver = ({ restartGame }) => {
  console.log('Game Over');
  return (
    <div className='gameOver'>
      <div>
        <h2>Game Over</h2>
        <button type='button' className='button' onClick={restartGame}>Retry</button>
      </div>
    </div>
  );
}