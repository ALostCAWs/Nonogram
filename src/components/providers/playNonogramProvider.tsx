/* ---- Imports Section */
import React, { useState, useEffect, useReducer } from 'react';
// Constants
import { PUZZLE_ACTIONS } from 'constants/puzzleActions';
// Contexts
import { FillModeContext } from 'contexts/fillModeContext';
// Components > UI
import { Board } from 'components/ui/board';
// Pages
import { GameComplete } from 'pages/gameComplete';
import { GameOver } from 'pages/gameOver';
// Functions
import { fillTile, markTile, hoverTile, resetInfoTiles } from 'functions/tileFunctions';
import { createLives, createCurrentPuzzle, checkZeroLines } from 'functions/puzzleSetup';
import { checkPuzzleComplete, checkGameOver } from 'functions/getPuzzleInfo';
/* End ---- */

// TODO:
// update look of the site; color scheme, life imgs, tile 'x' img

// incorporate backend for saving game progress, track completed puzzles

// play game & create game mode
// browse puzzles, store if user completed them

// Knows the puzzleSolution ( can be passed to board, maybe not needed though )
// Secondary currentPuzzle, same size as puzzleSolution, manages the users' progress
// Sets the FillModeContext, which is used to dictate which function the Tile components use as their onClick callback functions
// Tiles use callbacks to functions within when onClick
// When tile filled, NonogramProvider checks for column / row completion
// currentPuzzle passed to Board, making Board purely for displaying
interface PlayNonogramProviderProps {
  puzzleSolution: boolean[][]
}

export const PlayNonogramProvider = ({ puzzleSolution }: PlayNonogramProviderProps) => {
  // useState
  const [fillMode, setFillMode] = useState<boolean>(true);
  const [lives, setLives] = useState<number>(createLives(puzzleSolution));
  const [gameOver, setGameOver] = useState<boolean>(checkGameOver(lives));
  const [gameComplete, setGameComplete] = useState<boolean>(false);

  /* ---- useReducer */
  const [currentPuzzle, currentPuzzleDispatch] = useReducer(currentPuzzleReducer, createCurrentPuzzle(puzzleSolution));

  interface PuzzleAction {
    type: string,
    rowIndex: number,
    colIndex: number
  }

  function currentPuzzleReducer(puzzleState: string[][], action: PuzzleAction): string[][] {
    switch (action.type) {
      case PUZZLE_ACTIONS.RESET: {
        // Pre-resetPuzzle puzzleState / currentPuzzle was being used still after creating a fresh currentPuzzle, preventing gameComplete value from updating on retry puzzle start
        const resetPuzzle = checkZeroLines(createCurrentPuzzle(puzzleSolution), puzzleSolution);
        setLives(createLives(puzzleSolution));
        setGameComplete(checkPuzzleComplete(puzzleSolution, resetPuzzle));
        resetInfoTiles(puzzleSolution);
        return resetPuzzle
      }

      case PUZZLE_ACTIONS.SET_ZERO_LINES:
        return puzzleState = checkZeroLines(puzzleState, puzzleSolution);

      case PUZZLE_ACTIONS.FILL: {
        // fillTile determines whether the clicked tile should receive FILL_STATE.FILLED or FILL_STATE.ERROR
        // It returns an object with information on what changes fillTile made to the puzzle
        // The updatedPuzzle itself, whether a tile was given FILLED or ERROR, & whether or not the game is now complete
        const updatedPuzzleData = fillTile(puzzleSolution, puzzleState, action.rowIndex, action.colIndex);

        // tileFilled === null is a catch for attempts to fill an unfillable tile ( checkTileFillable returned false & no updates to the puzzle were made )
        // Don't need to worry about accidental changes to gameComplete as this will cause the function to return before it has a chance to update the gameComplete state
        if (updatedPuzzleData.tileFilled === null) {
          return updatedPuzzleData.puzzle;
        }

        // Error, reduce lives
        if (!updatedPuzzleData.tileFilled) {
          setLives(currentLives => currentLives - 1);
        }
        setGameComplete(updatedPuzzleData.gameComplete);

        return updatedPuzzleData.puzzle;
      }

      case PUZZLE_ACTIONS.MARK:
        return puzzleState = markTile(puzzleState, action.rowIndex, action.colIndex);

      default:
        return puzzleState;
    }
  }
  /* useReducer End ---- */

  /* useEffect ---- Game Setup / Change / Complete */
  useEffect(() => {
    // Triggers on component mount to ensure the fillMode is true on game start
    setFillMode(true);
  }, []);

  useEffect(() => {
    // Triggers on the change of the lives state to ensure the game ends when the user runs out of lives
    setGameOver(checkGameOver(lives));
  }, [lives]);

  useEffect(() => {
    // useEffect triggers on gameComplete change to call set any zero lines to fillState.error
    // Ensures zero lines are filled correctly when puzzle reset
    currentPuzzleDispatch({ type: PUZZLE_ACTIONS.SET_ZERO_LINES, rowIndex: 0, colIndex: 0 });
  }, [gameComplete]);

  useEffect(() => {
    // useEffect triggers on puzzleSolution change to call resetPuzzle
    currentPuzzleDispatch({ type: PUZZLE_ACTIONS.RESET, rowIndex: 0, colIndex: 0 });
  }, [puzzleSolution]);
  /* useEffect END ---- */

  /* ---- Toggle Fill Mode */
  const toggleFillMode = (): void => {
    // Disallow toggle when the game is finished
    if (gameComplete || gameOver) {
      return;
    }
    setFillMode(currentMode => !currentMode);
  }

  return (
    <>
      {gameOver && (
        <GameOver resetPuzzle={
          () => { currentPuzzleDispatch({ type: PUZZLE_ACTIONS.RESET, rowIndex: 0, colIndex: 0 }) }
        } />
      )}

      {gameComplete && (
        <GameComplete lives={lives} resetPuzzle={
          () => { currentPuzzleDispatch({ type: PUZZLE_ACTIONS.RESET, rowIndex: 0, colIndex: 0 }); }
        } />
      )}

      {!gameComplete && !gameOver ? (
        <FillModeContext.Provider value={fillMode}>
          <Board currentPuzzle={currentPuzzle} puzzleSolution={puzzleSolution} livesCount={lives}
            fillTile={
              (e, rowIndex, colIndex) => { currentPuzzleDispatch({ type: PUZZLE_ACTIONS.FILL, rowIndex: rowIndex, colIndex: colIndex }) }
            }
            markTile={
              (e, rowIndex, colIndex) => { currentPuzzleDispatch({ type: PUZZLE_ACTIONS.MARK, rowIndex: rowIndex, colIndex: colIndex }) }
            }
            hoverTile={hoverTile} />
        </FillModeContext.Provider>
      ) : (
        <FillModeContext.Provider value={fillMode}>
            <Board currentPuzzle={currentPuzzle} puzzleSolution={puzzleSolution} livesCount={lives}
              fillTile={
                (e, rowIndex, colIndex) => { }
              }
              markTile={
                (e, rowIndex, colIndex) => { }
              }
              hoverTile={
                (e, rowIndex, colIndex) => { }
              } />
        </FillModeContext.Provider>
      )}

      <button type='button' className='fillModeButton toggleFillMode button' onClick={() => toggleFillMode()} disabled={fillMode}>Fill</button>
      <button type='button' className='markModeButton toggleFillMode button' onClick={() => toggleFillMode()} disabled={!fillMode}>Mark</button>
    </>
  );
}