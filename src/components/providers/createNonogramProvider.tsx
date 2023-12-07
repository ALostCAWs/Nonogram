/* ---- Imports Section */
import React, { useState, useEffect } from 'react';
import App from 'App';
// Constants
import { FILL_STATE } from "constants/fillState";
// Components > UI
import { Board } from 'components/ui/board';
// Functions
import { hoverTile } from 'functions/tileFunctions';
import { checkBoardNotBlank } from 'functions/puzzleValidation';
import { createBlankPuzzle, createBoolPuzzle } from 'functions/puzzleSetup';
/* End ---- */

interface CreateNonogramProviderProps {
  boardHeight: number,
  boardWidth: number,
}

/**
 * Create Puzzle by providing user with a blank board & allowing them to toggle tile FILL_STATE.FILLED
 * Allows the user to create & export their own nonogram puzzle of a specified size
 *
 * @returns The Board containing the InfoTiles & Tiles to create the game with
 * @returns Loads the home screen when the puzzle is exported
 */
export const CreateNonogramProvider = ({ boardHeight, boardWidth }: CreateNonogramProviderProps) => {
  const [currentPuzzle, setCurrentPuzzle] = useState<string[][]>(createBlankPuzzle(boardHeight, boardWidth));
  const [submit, setSubmit] = useState<boolean>(false);
  const [boardBlank, setBoardBlank] = useState<boolean>(true);

  useEffect(() => {
    setBoardBlank(!checkBoardNotBlank(currentPuzzle));
    console.log(boardBlank);
  }, [currentPuzzle, boardBlank]);

  /* ---- Tile Interaction Functions */
  // R-click to toggle FILL_STATE FILLED / EMPTY
  const fillTile = (e: React.MouseEvent, rowIndex: number, colIndex: number): void => {
    setCurrentPuzzle(puzzle => {
      return puzzle.map((row, i) => {
        return row.map((fill, j) => {
          if (rowIndex === i && colIndex === j) {
            return fill === FILL_STATE.EMPTY ? FILL_STATE.FILLED : FILL_STATE.EMPTY;
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
          <Board currentPuzzle={currentPuzzle} puzzleSolution={[]} livesCount={undefined} fillTile={fillTile} markTile={(e, rowIndex, colIndex) => { }} hoverTile={hoverTile} />
          <button type='button' className='export button' onClick={() => {
            const puzzleCode = createBoolPuzzle(currentPuzzle);
            navigator.clipboard.writeText(puzzleCode).catch((e) => (console.error(e)));
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