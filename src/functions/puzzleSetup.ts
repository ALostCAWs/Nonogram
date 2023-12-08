/* ---- Imports Section */
// Constants
import { FILL_STATE } from 'constants/fillState';
// Functions
import { exportPuzzle } from 'functions/exportPuzzle';
import { getColumn, getLongestDimension } from 'functions/getPuzzleInfo';
import { setTileRowFillState, setTileColFillState } from './updatePuzzleLines';
/* End ---- */

/**
 * Set starting based on the longest dimension of the board
 *
 * @returns The number of lives to start the game with
 */
export const createLives = (puzzleSolution: boolean[][]): number => {
  const longestDimension = getLongestDimension(puzzleSolution);
  const lives = Math.ceil(longestDimension / 2);
  return lives;
}

/**
 * Creates a 2D array based on the given puzzle dimensions populated with FILL_STATE.EMPTY
 *
 * @param boardHeight
 * @param boardWidth
 * @returns {string[][]} blankPuzzle
 */
export const createBlankPuzzle = (boardHeight: number, boardWidth: number): string[][] => {
  const blankPuzzle: string[][] = [];
  for (let i = 0; i < boardHeight; i++) {
    const blankRow: string[] = [];
    for (let j = 0; j < boardWidth; j++) {
      blankRow.push(FILL_STATE.EMPTY);
    }
    blankPuzzle.push(blankRow);
  }
  return blankPuzzle;
}

/**
 * Creates a boolean[][] version of a string[][] ( Generates a created puzzles' solution )
 *
 * @param currentPuzzle
 * @returns {boolean[][]} puzzleSolution
 */
export const createBoolPuzzle = (currentPuzzle: string[][]): string => {
  const puzzleSolution: boolean[][] = [];
  for (let i = 0; i < currentPuzzle.length; i++) {
    const rowSolution: boolean[] = [];
    for (let j = 0; j < currentPuzzle[0].length; j++) {
      const filled = currentPuzzle[i][j] === FILL_STATE.FILLED ? true : false;
      rowSolution.push(filled);
    }
    puzzleSolution.push(rowSolution);
  }
  return exportPuzzle(puzzleSolution);
}

/**
 * @returns A deep copy of a given puzzleSolution, populated with FILL_STATE.EMPTY
 */
export const createCurrentPuzzle = (puzzleSolution: boolean[][]): string[][] => {
  const currentPuzzle: string[][] = [];
  for (let i = 0; i < puzzleSolution.length; i++) {
    currentPuzzle[i] = [];
    for (let j = 0; j < puzzleSolution[i].length; j++) {
      currentPuzzle[i][j] = FILL_STATE.EMPTY;
    }
  }
  return currentPuzzle;
}

/**
 * @returns A deep copy of a given currentPuzzle
 */
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

/**
 * Checks a puzzleSolution for false-only lines
 * Find zero hint lines ( rows and/or columns ) & pass to functions to set FILL_STATE.ERROR
 * If not found, the updatedPuzzle is unchanged
 *
 * @returns updatedPuzzle with any zero lines set to FILL_STATE.ERROR
 */
export const checkAndSetZeroLines = (updatedPuzzle: string[][], puzzleSolution: boolean[][]): string[][] => {
  for (let i = 0; i < puzzleSolution[0].length; i++) {
    const col = new Set(getColumn(puzzleSolution, i));
    if (col.size === 1 && col.has(false)) {
      updatedPuzzle = setTileColFillState(updatedPuzzle, i, FILL_STATE.ERROR);
    }
  }
  for (let i = 0; i < puzzleSolution.length; i++) {
    const row = new Set(puzzleSolution[i]);
    if (row.size === 1 && row.has(false)) {
      updatedPuzzle = setTileRowFillState(updatedPuzzle, i, FILL_STATE.ERROR);
    }
  }
  return updatedPuzzle;
}