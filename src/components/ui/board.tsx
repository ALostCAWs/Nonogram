/* ---- Imports Section */
import React from 'react';
// Components
import { Tile } from 'components/ui/tile';
import { Hints } from 'components/ui/hints';
// Functions
import { getPuzzleByColumn, getLongestDimension, getMaxHintCountByLineLength } from 'functions/getPuzzleInfo';
/* End ---- */

interface BoardProps {
  currentPuzzle: string[][],
  puzzleSolution: boolean[][],
  livesCount: number | undefined,
  fillTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void,
  markTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void,
  hoverTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void,
}

export const Board = ({ currentPuzzle, puzzleSolution = [], livesCount, fillTile, markTile, hoverTile }: BoardProps) => {
  // Decouple tiles from board by mapping within return rather than for looping in useEffect
  let currentPuzzleByColumn: string[][] = getPuzzleByColumn(currentPuzzle);
  let puzzleSolutionByColumn: boolean[][] = [];
  let nonogramPaddingRight = 0;
  if (puzzleSolution.length !== 0) {
    puzzleSolutionByColumn = getPuzzleByColumn(puzzleSolution);
    nonogramPaddingRight = currentPuzzle[0].length * 12
  }

  let longestDimension = getLongestDimension(currentPuzzle);
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
      <div className='boardContainer' style={{ width: tileSize * (currentPuzzle[0].length + 1) }}>
        {puzzleSolution.length !== 0 && (
          <>
            <div className='colHintContainer' key='colHintContainer' style={{ gridTemplateColumns: `repeat(${currentPuzzle[0].length}, 1fr)` }}>
              {puzzleSolutionByColumn.map((line, i) =>
                <div key={`colHint${i}`} data-testid={`colHint${i}`} className={`colHints colHint${i}`} style={{ height: line.length * 12, width: tileSize }}>
                  <Hints puzzleSolutionLine={puzzleSolutionByColumn[i]} currentPuzzleLine={currentPuzzleByColumn[i]} lineIndex={i} maxHintCount={getMaxHintCountByLineLength(line.length)} lineType={'col'} />
                </div>
              )}
            </div>

            <div className='rowHintContainer' key='rowHintContainer' style={{ gridTemplateRows: `repeat(${currentPuzzle.length}, 1fr)` }}>
              {puzzleSolution.map((line, i) =>
                <div key={`rowHint${i}`} data-testid={`rowHint${i}`} className={`rowHints rowHint${i}`} style={{ height: tileSize, width: line.length * 12 }}>
                  <Hints puzzleSolutionLine={line} currentPuzzleLine={currentPuzzle[i]} lineIndex={i} maxHintCount={getMaxHintCountByLineLength(line.length)} lineType={'row'} />
                </div>
              )}
            </div>
          </>
        )}

        <div className='board' style={{ gridTemplateColumns: `repeat(${currentPuzzle[0].length}, 1fr)` }}>
          {currentPuzzle.map((row, i) =>
            row.map((col, j) =>
              <Tile key={`${i} - ${j}`} fill={currentPuzzle[i][j]} rowIndex={i} colIndex={j} tileSize={tileSize} fillTile={fillTile} markTile={markTile} hoverTile={hoverTile} />
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