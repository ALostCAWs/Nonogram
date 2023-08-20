/* ---- Imports Section */
import React, { useEffect, useState } from 'react';
/* End ---- */

export const GameComplete = ({ lives, restartGame }) => {
  console.log('Game Complete !!');
  return (
    <div className='gameComplete'>
      <h2>{`Puzzle solved with ${lives} lives remaining`}</h2>
      <button type='button' className='button' onClick={restartGame}>Retry</button>
    </div>
  );
}