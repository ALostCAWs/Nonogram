/* ---- Imports Section */
import { fillState } from 'constants/fillState';
import { getColumn, getLongestDimension } from 'functions/getPuzzleInfo';
import { setTileRowFillState, setTileColFillState } from './updatePuzzleLines';
/* End ---- */

/* ---- Initial Puzzle Setup Functions */
/* ---- Create lives  */
export const createLives = (puzzleSolution: boolean[][]): number => {
  // Set starting  based on the longest dimension of the board
  const longestDimension = getLongestDimension(puzzleSolution);
  const lives = Math.ceil(longestDimension / 2);
  return lives;
}

/* ---- Create / Copy currentPuzzle  */
export const createCurrentPuzzle = (puzzleSolution: boolean[][]): string[][] => {
  const currentPuzzle: string[][] = [];
  for (let i = 0; i < puzzleSolution.length; i++) {
    currentPuzzle[i] = [];
    for (let j = 0; j < puzzleSolution[i].length; j++) {
      currentPuzzle[i][j] = fillState.empty;
    }
  }
  return currentPuzzle;
}

// A simple assignment failed to trigger a re-render due to the arrays referencing the same point in memory
export const copyCurrentPuzzle = (currentPuzzle: string[][]): string[][] => {
  const puzzleCopy: string[][] = [];
  for (let i = 0; i < currentPuzzle.length; i++) {
    puzzleCopy[i] = [];
    for (let j = 0; j < currentPuzzle[i].length; j++) {
      puzzleCopy[i][j] = currentPuzzle[i][j];
    }
  }
  return puzzleCopy;
}

/* ---- Check / Set zero lines */
export const checkZeroLines = (updatedPuzzle: string[][], puzzleSolution: boolean[][]): string[][] => {
  // Find zero hint lines ( rows and/or columns ) & pass to functions to set fillState.error
  for (let i = 0; i < puzzleSolution[0].length; i++) {
    const col = new Set(getColumn(puzzleSolution, i));
    if (col.size === 1 && col.has(false)) {
      setTileColFillState(updatedPuzzle, i, fillState.error);
    }
  }
  for (let i = 0; i < puzzleSolution.length; i++) {
    const row = new Set(puzzleSolution[i]);
    if (row.size === 1 && row.has(false)) {
      setTileRowFillState(updatedPuzzle, i, fillState.error);
    }
  }
  return updatedPuzzle;
}