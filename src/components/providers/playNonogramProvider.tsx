/* ---- Imports Section */
import React, { useState, useEffect, createContext } from 'react';
// Constants
import { fillState } from 'constants/fillState';
// Contexts
import { FillModeContext } from 'contexts/fillModeContext';
// Components > UI
import { Board } from 'components/ui/board';
// Pages
import { GameComplete } from 'pages/gameComplete';
import { GameOver } from 'pages/gameOver';
// Functions
import { createLives, createCurrentPuzzle, copyCurrentPuzzle, checkZeroLines } from 'functions/puzzleSetup';
import { checkLineComplete, checkPuzzleComplete, checkGameOver, checkTileFillable, checkTileMarkable, getColumn } from 'functions/getPuzzleInfo';
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
  const [fillMode, setFillMode] = useState<boolean>(true);
  const [currentPuzzle, setCurrentPuzzle] = useState<string[][]>(createCurrentPuzzle(puzzleSolution));
  const [lives, setLives] = useState<number>(createLives(puzzleSolution));
  const [gameComplete, setGameComplete] = useState<boolean>(checkPuzzleComplete(puzzleSolution, currentPuzzle));

  /* useEffect ---- Game Setup / Change / Complete */
  useEffect(() => {
    setFillMode(true);
  }, []);

  // useEffect triggers on gameComplete change to call set any zero lines to fillState.error
  // Ensures zero lines are filled correctly when puzzle reset
  useEffect(() => {
    setCurrentPuzzle(puzzle => checkZeroLines(puzzle, puzzleSolution));
  }, [gameComplete]);

  // useEffect triggers on puzzleSolution change to call resetPuzzle
  useEffect(() => {
    resetPuzzle();
  }, [puzzleSolution]);

  /* Functions ---- */
  /* ---- Puzzle Setup / Change / Complete */
  const resetPuzzle = (): void => {
    // Using resetPuzzle in place of currentPuzzle to avoid initialization issues
    // Pre-resetPuzzle currentPuzzle was being used still after creating a fresh currentPuzzle, preventing gameComplete value from updating on retry puzzle start
    const resetPuzzle = checkZeroLines(createCurrentPuzzle(puzzleSolution), puzzleSolution);
    setCurrentPuzzle(resetPuzzle);
    setLives(createLives(puzzleSolution));
    setGameComplete(checkPuzzleComplete(puzzleSolution, resetPuzzle));
  }

  /* ---- Toggle Fill Mode */
  const toggleFillMode = (): void => {
    if (gameComplete || checkGameOver(lives)) {
      return;
    }
    setFillMode(currentMode => !currentMode);
  }

  /* ---- Tile Interaction */
  // R-click to attempt fill, fillState.filled & fillState.error are not removable
  const fillTile = (e: React.MouseEvent, rowIndex: number, colIndex: number): void => {
    if (gameComplete || checkGameOver(lives)) {
      return;
    }
    if (!checkTileFillable(currentPuzzle[rowIndex][colIndex])) {
      return;
    }

    if (puzzleSolution[rowIndex][colIndex]) {
      const clickedRow = document.querySelector(`.rowInfo${rowIndex}`);
      const clickedCol = document.querySelector(`.colInfo${colIndex}`);
      let updatedPuzzle = copyCurrentPuzzle(currentPuzzle);
      updatedPuzzle[rowIndex][colIndex] = fillState.filled;

      // Check if filling the tile completed the column and / or row it's in
      const colLineComplete = checkLineComplete(getColumn(puzzleSolution, colIndex), getColumn(updatedPuzzle, colIndex));
      const rowLineComplete = checkLineComplete(puzzleSolution[rowIndex], updatedPuzzle[rowIndex]);

      // If line is complete, set all empty or marked tiles to complete
      if (clickedCol !== null && colLineComplete) {
        console.log('col complete');
        clickedCol.classList.add('completeLineHint');
        updatedPuzzle = setColComplete(updatedPuzzle, colIndex);
      }
      if (clickedRow !== null && rowLineComplete) {
        console.log('row complete');
        clickedRow.classList.add('completeLineHint');
        updatedPuzzle = setRowComplete(updatedPuzzle, rowIndex);
      }
      // Only need to check for game completion if both a column & row were completed by this tile being filled
      if (colLineComplete && rowLineComplete) {
        setGameComplete(checkPuzzleComplete(puzzleSolution, updatedPuzzle));
      }
      setCurrentPuzzle(updatedPuzzle);
    } else {
      // Upon error, reduce lives
      setCurrentPuzzle(puzzle => {
        return puzzle.map((row, i) => {
          return row.map((fill, j) => {
            if (rowIndex === i && colIndex === j) {
              return fillState.error;
            } else {
              return fill;
            }
          });
        });
      });
      setLives(currentLives => currentLives - 1);
    }
  }

  // L-click to mark ( used as a removable penalty-free reference )
  const markTile = (e: React.MouseEvent, rowIndex: number, colIndex: number): void => {
    if (gameComplete || checkGameOver(lives)) {
      return;
    }
    if (!checkTileMarkable(currentPuzzle[rowIndex][colIndex])) {
      return;
    }

    e.preventDefault();
    setCurrentPuzzle(puzzle => {
      return puzzle.map((row, i) => {
        return row.map((fill, j) => {
          if (rowIndex === i && colIndex === j) {
            return fill === fillState.empty ? fillState.marked : fillState.empty;
          } else {
            return fill;
          }
        });
      });
    });
  }

  // Hovering over a tile highlights it & its' corresponding column / row hints
  const hoverTile = (e: React.MouseEvent, rowIndex: number, colIndex: number): void => {
    if (gameComplete || checkGameOver(lives)) {
      return;
    }
    const hoverRow = document.querySelector(`.rowInfo${rowIndex}`);
    const hoverCol = document.querySelector(`.colInfo${colIndex}`);

    if (hoverRow === null || hoverCol === null) {
      return;
    }
    if (e.type === 'mouseenter') {
      hoverRow.classList.add('hoverInfo');
      hoverCol.classList.add('hoverInfo');
    }
    if (e.type === 'mouseleave') {
      hoverRow.classList.remove('hoverInfo');
      hoverCol.classList.remove('hoverInfo');
    }
  }

  /* ---- Tile Interaction Trigger Hint Change Functions */
  // If line complete, set remaining tiles in column / row to complete
  // This is only set for lines in which every fillable tile has been filled, specifically NOT for lines with 0 fillable tiles or incomplete lines
  // Lines with 0 fillable tiles are all marked error on puzzle initialization
  // Lines with some completed hints do not trigger this, even in obvious cases such as first / last hint completion
  // This keeps in line with existing nonogram puzzles; avoids holding users' hand too much
  // In this puzzle, fillState.complete is set up to specifically disallow removal unlike many other nonogram puzzles as that feels unfair for a user to be able to accidentally undo their own progress ( in a sense ) & trigger errors on lines they have already solved
  const setColComplete = (updatedPuzzle: string[][], colIndex: number): string[][] => {
    for (let i = 0; i < currentPuzzle.length; i++) {
      if (updatedPuzzle[i][colIndex] === fillState.empty || updatedPuzzle[i][colIndex] === fillState.marked) {
        // fillState.complete matches fillState.marked visually, but cannot be removed
        updatedPuzzle[i][colIndex] = fillState.complete;
      }
    }
    return updatedPuzzle;
  }

  const setRowComplete = (updatedPuzzle: string[][], rowIndex: number): string[][] => {
    for (let i = 0; i < updatedPuzzle[0].length; i++) {
      if (updatedPuzzle[rowIndex][i] === fillState.empty || updatedPuzzle[rowIndex][i] === fillState.marked) {
        // fillState.complete matches fillState.marked visually, but cannot be removed
        updatedPuzzle[rowIndex][i] = fillState.complete;
      }
    }
    return updatedPuzzle;
  }

  return (
    <>
      {checkGameOver(lives) && (
        <GameOver resetPuzzle={resetPuzzle} />
      )}

      {gameComplete && (
        <GameComplete lives={lives} resetPuzzle={resetPuzzle} />
      )}

      <FillModeContext.Provider value={fillMode}>
        <Board currentPuzzle={currentPuzzle} puzzleSolution={puzzleSolution} livesCount={lives} fillTile={fillTile} markTile={markTile} hoverTile={hoverTile} />
      </FillModeContext.Provider>

      <button type='button' className='fillModeButton toggleFillMode button' onClick={() => toggleFillMode()} disabled={fillMode}>Fill</button>
      <button type='button' className='markModeButton toggleFillMode button' onClick={() => toggleFillMode()} disabled={!fillMode}>Mark</button>
    </>
  );
}