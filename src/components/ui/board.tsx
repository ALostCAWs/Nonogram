/* ---- Imports Section */
import React from 'react';
// Components > UI
import { Tile } from 'components/ui/tile';
import { InfoTile } from 'components/ui/infoTile';
// Functions
import { getPuzzleByColumn, getLongestDimension } from 'functions/getPuzzleInfo';
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
  const currentPuzzleByColumn: string[][] = getPuzzleByColumn(currentPuzzle);
  let puzzleSolutionByColumn: boolean[][] = [];
  const nonogramPaddingRight = currentPuzzle[0].length * 12;
  if (puzzleSolution.length !== 0) {
    puzzleSolutionByColumn = getPuzzleByColumn(puzzleSolution);
  }

  const longestDimension = getLongestDimension(currentPuzzle);
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
        <div className='colInfoContainer' key='colInfoContainer' style={{ gridTemplateColumns: `repeat(${currentPuzzle[0].length}, 1fr)` }}>
          <InfoTile currentPuzzle={currentPuzzleByColumn} puzzleSolution={puzzleSolutionByColumn} tileSize={tileSize} lineType={'col'} />
        </div>
        <div className='rowInfoContainer' key='rowInfoContainer' style={{ gridTemplateRows: `repeat(${currentPuzzle.length}, 1fr)` }}>
          <InfoTile currentPuzzle={currentPuzzle} puzzleSolution={puzzleSolution} tileSize={tileSize} lineType={'row'} />
        </div>

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