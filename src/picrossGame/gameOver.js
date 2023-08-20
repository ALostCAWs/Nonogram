/* ---- Imports Section */
import React, { useEffect, useState } from 'react';
import { Board } from './board';
import { checkLineComplete, checkGameComplete } from './checkComplete';
import { GetColumn } from './getBoardInfo';
/* End ---- */

export const GameOver = () => {
  console.log('Game Over');
  return (
    <div className='gameOver overlay'>
      <div>
        <h2>Game Over</h2>
        <button type='button' className='button'>Retry</button>
      </div>
    </div>
  );
}