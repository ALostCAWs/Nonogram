/* ---- Imports Section */
import React, { useState, useEffect } from 'react';
import App from 'App';
// Constants
import { fillState } from "constants/fillState";
// Components > UI
import { Board } from 'components/ui/board';
// Functions
import { exportPuzzle } from 'functions/exportPuzzle';
import { checkBoardNotBlank } from 'functions/puzzleValidation';
/* End ---- */

/* ---- Create Puzzle by providing user with a blank board & allowing them to toggle tile fillState.filled */
// Call exportPuzzle on submit
interface CreateNonogramProviderProps {
  boardHeight: number,
  boardWidth: number,
}

export const CreateNonogramProvider = ({ boardHeight, boardWidth }: CreateNonogramProviderProps) => {
  const [currentPuzzle, setCurrentPuzzle] = useState<string[][]>(createBlankPuzzle(boardHeight, boardWidth));
  const [submit, setSubmit] = useState<boolean>(false);
  const [boardBlank, setBoardBlank] = useState<boolean>(true);

  useEffect(() => {
    setBoardBlank(!checkBoardNotBlank(currentPuzzle));
    console.log(boardBlank);
  }, [currentPuzzle, boardBlank]);

  /* ---- Tile Interaction Functions */
  // R-click to toggle fillState filled / empty
  const fillTile = (e: React.MouseEvent, rowIndex: number, colIndex: number): void => {
    setCurrentPuzzle(puzzle => {
      return puzzle.map((row, i) => {
        return row.map((fill, j) => {
          if (rowIndex === i && colIndex === j) {
            return fill === fillState.empty ? fillState.filled : fillState.empty;
          } else {
            return fill;
          }
        });
      });
    });
  }
  // Add submit button under provider
  return (
    <>
      {!submit && (
        <>
          <Board currentPuzzle={currentPuzzle} puzzleSolution={[]} livesCount={undefined} fillTile={fillTile} markTile={(e, rowIndex, colIndex) => { }} hoverTile={(e, rowIndex, colIndex) => { }} />
          <button type='button' className='export button' onClick={async () => {
            const puzzleCode = createBoolPuzzle(currentPuzzle);
            await navigator.clipboard.writeText(puzzleCode);
            setSubmit(true);
          }} disabled={boardBlank}>Export</button>
        </>
      )}
      {submit && (
        <>
          <App />
        </>
      )}
    </>
  );
}

const createBlankPuzzle = (boardHeight: number, boardWidth: number): string[][] => {
  const blankPuzzle: string[][] = [];
  for (let i = 0; i < boardHeight; i++) {
    const blankRow: string[] = [];
    for (let j = 0; j < boardWidth; j++) {
      blankRow.push(fillState.empty);
    }
    blankPuzzle.push(blankRow);
  }
  return blankPuzzle;
}

const createBoolPuzzle = (currentPuzzle: string[][]): string => {
  const puzzleSolution: boolean[][] = [];
  for (let i = 0; i < currentPuzzle.length; i++) {
    const rowSolution: boolean[] = [];
    for (let j = 0; j < currentPuzzle[0].length; j++) {
      const filled = currentPuzzle[i][j] === fillState.filled ? true : false;
      rowSolution.push(filled);
    }
    puzzleSolution.push(rowSolution);
  }
  return exportPuzzle(puzzleSolution);
}