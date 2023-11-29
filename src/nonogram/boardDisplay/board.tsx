/* ---- Imports Section */
import React from 'react';
// Components
import { Tile } from './tile.tsx';
import { Hints } from './hints.tsx';
// Functions
import { getGameByColumn, getLongestDimension, getMaxHintCountByLineLength } from './getBoardInfo.ts';
/* End ---- */

interface BoardProps {
  currentGame: string[][],
  gameSolution: boolean[][],
  livesCount: number | undefined,
  fillTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void,
  markTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void,
  hoverTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void,
}

export const Board = ({ currentGame, gameSolution = [], livesCount, fillTile, markTile, hoverTile }: BoardProps) => {
  // Decouple tiles from board by mapping within return rather than for looping in useEffect
  let currentGameByColumn: string[][] = getGameByColumn(currentGame);
  let gameSolutionByColumn: boolean[][] = [];
  let nonogramPaddingRight = 0;
  if (gameSolution.length !== 0) {
    gameSolutionByColumn = getGameByColumn(gameSolution);
    nonogramPaddingRight = currentGame[0].length * 12
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

  let lives: number[] = [];
  if (livesCount !== undefined) {
    lives = [...Array(livesCount).keys()];
  }

  return (
    <div className='nonogram' style={{ paddingRight: nonogramPaddingRight }}>
      <div className='boardContainer' style={{ width: tileSize * (currentGame[0].length + 1) }}>
        {gameSolution.length !== 0 && (
          <>
            <div className='colHintContainer' key='colHintContainer' style={{ gridTemplateColumns: `repeat(${currentGame[0].length}, 1fr)` }}>
              {gameSolutionByColumn.map((line, i) =>
                <div key={`colHint${i}`} data-testid={`colHint${i}`} className={`colHints colHint${i}`} style={{ height: line.length * 12, width: tileSize }}>
                  <Hints lineGameSolution={gameSolutionByColumn[i]} currentLineGame={currentGameByColumn[i]} lineIndex={i} maxHintCount={getMaxHintCountByLineLength(line.length)} lineType={'col'} />
                </div>
              )}
            </div>

            <div className='rowHintContainer' key='rowHintContainer' style={{ gridTemplateRows: `repeat(${currentGame.length}, 1fr)` }}>
              {gameSolution.map((line, i) =>
                <div key={`rowHint${i}`} data-testid={`rowHint${i}`} className={`rowHints rowHint${i}`} style={{ height: tileSize, width: line.length * 12 }}>
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

        {livesCount !== 0 && (
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
interface LifeProps {
  tileSize: number
}

const Life = ({ tileSize }: LifeProps) => {
  return (
    <div data-testid={'life'} className='life' style={{ height: tileSize, width: tileSize }}></div>
  );
}