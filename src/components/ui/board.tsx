import React from 'react';
import { TileState } from 'interfaces/tileState';
import { Tile } from 'components/ui/tile';
import { InfoTile } from 'components/ui/infoTile';
import { Life } from './life';
import { getPuzzleByColumn, getLongestDimension } from 'functions/getPuzzleInfo';

interface BoardProps {
  currentPuzzle: TileState[][],
  puzzleSolution: boolean[][],
  livesCount: number | undefined
}

/**
 * currentPuzzle maintains the Boards' appearance
 * puzzleSolution contains whether or not each Tile should be filled
 * Decouple Tiles from Board by mapping within the return
 *
 * @returns InfoTile set for columns
 * @returns InfoTile set for rows
 * @returns Tile for each item in currentPuzzle
 * @returns Life components equal to the livesCount prop
 */
export const Board = ({ currentPuzzle, puzzleSolution = [], livesCount }: BoardProps) => {
  const currentPuzzleByColumn = getPuzzleByColumn(currentPuzzle);
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
          <InfoTile
            currentPuzzle={currentPuzzleByColumn}
            puzzleSolution={puzzleSolutionByColumn}
            tileSize={tileSize}
            lineType={'col'}
          />
        </div>
        <div className='rowInfoContainer' key='rowInfoContainer' style={{ gridTemplateRows: `repeat(${currentPuzzle.length}, 1fr)` }}>
          <InfoTile
            currentPuzzle={currentPuzzle}
            puzzleSolution={puzzleSolution}
            tileSize={tileSize}
            lineType={'row'}
          />
        </div>

        <div className='board' style={{ gridTemplateColumns: `repeat(${currentPuzzle[0].length}, 1fr)` }}>
          {currentPuzzle.map((row, i) =>
            row.map((col, j) =>
              <Tile key={`${i} - ${j}`}
                fill={currentPuzzle[i][j].fill}
                selected={currentPuzzle[i][j].selected}
                rowIndex={i}
                colIndex={j}
                tileSize={tileSize}
              />
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