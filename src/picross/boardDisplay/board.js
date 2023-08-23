/* ---- Imports Section */
import React from 'react';
// Components
import { Tile } from './tile';
import { Hints } from './hints';
// Functions
import { getColumn } from '../playGame/getBoardInfo';
/* End ---- */

export const Board = ({ currentGame, gameSolution = undefined, lives = undefined, fillTile, markTile, hoverTile }) => {
  // Decouple tiles from board by mapping within return rather than for looping in useEffect
  if (lives !== undefined) {
    lives = [...Array(lives).keys()];
  }
  return (
    <div className='boardContainer'>
      {gameSolution && (
        <>
          <div className='colHintContainer' key='colHintContainer'>
            {gameSolution.map((row, i) =>
              <div key={`colHintCollection${i}`} className={`colHints colHint${i}`}>
                <Hints lineGameSolution={getColumn(gameSolution, i)} currentLineGame={getColumn(currentGame, i)} lineIndex={i} />
              </div>
            )}
          </div>

          <div className='rowHintContainer' key='rowHintContainer'>
            {gameSolution.map((row, i) =>
              <div key={`rowHintCollection${i}`} className={`rowHints rowHint${i}`}>
                <Hints lineGameSolution={row} currentLineGame={currentGame[i]} lineIndex={i} />
              </div>
            )}
          </div>
        </>
      )}

      <div className='board'>
        {currentGame.map((row, i) =>
          row.map((col, j) =>
            <Tile key={`${i} - ${j}`} fill={currentGame[i][j]} rowIndex={i} colIndex={j} fillTile={fillTile} markTile={markTile} hoverTile={hoverTile} />
          )
        )}
      </div>

      {lives && (
        <>
          <div className='livesContainer'>
            {lives.map((life, i) =>
              <Life key={`Life ${i + 1}`} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Displays one life counter element per life remaining
const Life = () => {
  return (
    <div className='life'></div>
  );
}