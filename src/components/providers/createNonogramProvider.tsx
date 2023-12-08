/* ---- Imports Section */
import React, { useState, useEffect, useReducer } from 'react';
import App from 'App';
// Constants
import { PUZZLE_ACTIONS } from 'constants/puzzleActions';
import { FILL_STATE } from "constants/fillState";
// Components > UI
import { Board } from 'components/ui/board';
// Functions
import { hoverTile } from 'functions/tileFunctions';
import { checkBoardNotBlank } from 'functions/puzzleValidation';
import { createBlankPuzzle, createBoolPuzzle, copyCurrentPuzzle } from 'functions/puzzleSetup';
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
  //const [currentPuzzle, setCurrentPuzzle] = useState<string[][]>(createBlankPuzzle(boardHeight, boardWidth));
  const [submit, setSubmit] = useState<boolean>(false);
  const [boardBlank, setBoardBlank] = useState<boolean>(true);

  /* ---- useReducer */
  const [currentPuzzle, currentPuzzleDispatch] = useReducer(currentPuzzleReducer, createBlankPuzzle(boardHeight, boardWidth));

  interface PuzzleAction {
    type: string,
    rowIndex: number,
    colIndex: number
  }

  function currentPuzzleReducer(puzzleState: string[][], action: PuzzleAction): string[][] {
    switch (action.type) {

      case PUZZLE_ACTIONS.FILL: {
        const updatedPuzzle = copyCurrentPuzzle(puzzleState);
        updatedPuzzle[action.rowIndex][action.colIndex] = updatedPuzzle[action.rowIndex][action.colIndex] === FILL_STATE.EMPTY ? FILL_STATE.FILLED : FILL_STATE.EMPTY;
        return updatedPuzzle;
      }

      default:
        return puzzleState;
    }
  }

  useEffect(() => {
    setBoardBlank(!checkBoardNotBlank(currentPuzzle));
    console.log(boardBlank);
  }, [currentPuzzle, boardBlank]);

  return (
    <>
      {!submit && (
        <>
          <Board currentPuzzle={currentPuzzle} puzzleSolution={[]} livesCount={undefined}
            fillTile={
              (e, rowIndex, colIndex) => { currentPuzzleDispatch({ type: PUZZLE_ACTIONS.FILL, rowIndex: rowIndex, colIndex: colIndex }) }
            }
            markTile={(e, rowIndex, colIndex) => { }}
            hoverTile={hoverTile} />
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