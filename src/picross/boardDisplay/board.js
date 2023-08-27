/* ---- Imports Section */
import React from 'react';
// Components
import { Tile } from './tile';
import { Hints } from './hints';
// Functions
import { getGameByColumn, getLongestDimension, getMaxHintCountByLineLength } from '../playGame/getBoardInfo';
/* End ---- */

export const Board = ({ currentGame, gameSolution = undefined, lives = undefined, fillTile, markTile, hoverTile }) => {
  // Decouple tiles from board by mapping within return rather than for looping in useEffect
  let currentGameByColumn = getGameByColumn(currentGame);
  let gameSolutionByColumn = [];
  let picrossPaddingRight = 0;
  if (gameSolution) {
    gameSolutionByColumn = getGameByColumn(gameSolution);
    picrossPaddingRight = currentGame[0].length * 12
  }

  let longestDimension = getLongestDimension(currentGame);
  let tileSize = 300;
  switch (true) {
    case (longestDimension > 15):
      tileSize = 30;
      break;
    case (longestDimension > 10):
      tileSize = 40;
      break;
    default:
      tileSize = 60;
      break;
  }

  if (lives !== undefined) {
    lives = [...Array(lives).keys()];
  }

  return (
    <div className='picross' style={{ paddingRight: picrossPaddingRight }}>
      <div className='boardContainer' style={{ width: tileSize * (currentGame[0].length + 1) }}>
        {gameSolution && (
          <>
            <div className='colHintContainer' key='colHintContainer' style={{ gridTemplateColumns: `repeat(${currentGame[0].length}, 1fr)` }}>
              {gameSolutionByColumn.map((line, i) =>
                <div key={`colHintCollection${i}`} className={`colHints colHint${i}`} style={{ height: line.length * 12, width: tileSize }}>
                  <Hints lineGameSolution={gameSolutionByColumn[i]} currentLineGame={currentGameByColumn[i]} lineIndex={i} maxHintCount={getMaxHintCountByLineLength(line.length)} lineType={'col'} />
                </div>
              )}
            </div>

            <div className='rowHintContainer' key='rowHintContainer' style={{ gridTemplateRows: `repeat(${currentGame.length}, 1fr)` }}>
              {gameSolution.map((line, i) =>
                <div key={`rowHintCollection${i}`} className={`rowHints rowHint${i}`} style={{ height: tileSize, width: line.length * 12 }}>
                  <Hints lineGameSolution={line} currentLineGame={currentGame[i]} lineIndex={i} maxHintCount={getMaxHintCountByLineLength(line.length)} lineType={'row'} />
                </div>
              )}
            </div>
          </>
        )}

        <div className='board' style={{ gridTemplateColumns: `repeat(${currentGame[0].length}, 1fr)` }}>
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