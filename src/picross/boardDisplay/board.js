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
  console.log(currentGame);
  let longestDimension = currentGame.length >= currentGame[0].length ? currentGame.length : currentGame[0].length;
  console.log(longestDimension);

  let sizeClassName = '';
  let tileSize = 75;
  switch (true) {
    case (longestDimension > 15):
      sizeClassName = 'large';
      tileSize = 30;
      break;
    case (longestDimension > 10):
      sizeClassName = 'medium';
      tileSize = 40;
      break;
    default:
      sizeClassName = 'small';
      tileSize = 60;
      break;
  }

  if (lives !== undefined) {
    lives = [...Array(lives).keys()];
  }
  return (
    <div className='picross'>
      <div className={`boardContainer ${sizeClassName}BoardContainer`}>
        {gameSolution && (
          <>
            <div className='colHintContainer' key='colHintContainer' style={{ gridTemplateColumns: `repeat(${currentGame[0].length}, auto)` }}>
              {gameSolution.map((row, i) =>
                <div key={`colHintCollection${i}`} className={`colHints colHint${i}`} style={{ height: tileSize, width: tileSize }}>
                  <Hints lineGameSolution={getColumn(gameSolution, i)} currentLineGame={getColumn(currentGame, i)} lineIndex={i} />
                </div>
              )}
            </div>

            <div className='rowHintContainer' key='rowHintContainer' style={{ gridTemplateRows: `repeat(${currentGame.length}, auto)` }}>
              {gameSolution.map((row, i) =>
                <div key={`rowHintCollection${i}`} className={`rowHints rowHint${i}`} style={{ height: tileSize, width: tileSize }}>
                  <Hints lineGameSolution={row} currentLineGame={currentGame[i]} lineIndex={i} />
                </div>
              )}
            </div>
          </>
        )}

        <div className='board' style={{ gridTemplateColumns: `repeat(${currentGame.length}, auto)` }}>
          {currentGame.map((row, i) =>
            row.map((col, j) =>
              <Tile key={`${i} - ${j}`} fill={currentGame[i][j]} rowIndex={i} colIndex={j} tileSize={tileSize} fillTile={fillTile} markTile={markTile} hoverTile={hoverTile} />
            )
          )}
        </div>

        {lives && (
          <>
            <div className='livesContainer'>
              {lives.map((life, i) =>
                <Life key={`Life ${i + 1}`} tileSize={tileSize} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Displays one life counter element per life remaining
const Life = ({ tileSize }) => {
  return (
    <div className='life' style={{ height: tileSize, width: tileSize }}></div>
  );
}