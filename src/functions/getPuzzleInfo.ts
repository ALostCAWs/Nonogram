import { FILL_STATE } from "constants/fillState";

/**
 * Column Quality of Life
 *
 * @returns A 1D array of the columns' values
 */
export const getColumn = <T>(inputPuzzle: T[][], colIndex: number): T[] => {
  const column: T[] = [];
  for (let i = 0; i < inputPuzzle.length; i++) {
    column.push(inputPuzzle[i][colIndex]);
  }
  return column;
}

/**
 * Column Quality of Life
 * Rotates a given matrix
 * This allows for the returned puzzleByColumns' columns to be accessed in the same way as rows
 * i.e., const col_3 = puzzleByColumn[3]
 *
 * @returns A rotated matrix of a given puzzle
 */
export const getPuzzleByColumn = <T>(inputPuzzle: T[][]): T[][] => {
  const puzzleByColumn: T[][] = [];
  for (let i = 0; i < inputPuzzle[0].length; i++) {
    const column: T[] = getColumn(inputPuzzle, i);
    puzzleByColumn.push(column);
  }
  return puzzleByColumn;
}

/**
 * Check if a given column / row is complete
 */
export const checkLineComplete = (puzzleSolutionLine: boolean[], updatedPuzzleLine: string[]): boolean => {
  for (let i = 0; i < puzzleSolutionLine.length; i++) {
    if (puzzleSolutionLine[i] && updatedPuzzleLine[i] !== FILL_STATE.FILLED) {
      return false;
    }
  }
  return true;
}

/**
 * Check each column & row for completion, calls checkLineComplete to accomplish this
 * Returns false as soon as an incomplete line is found to prevent unnecessary looping
 */
export const checkPuzzleComplete = (puzzleSolution: boolean[][], updatedPuzzle: string[][]): boolean => {
  for (let i = 0; i < puzzleSolution.length; i++) {
    let gameComplete = checkLineComplete(getColumn(puzzleSolution, i), getColumn(updatedPuzzle, i));
    if (!gameComplete) {
      return false;
    }
    gameComplete = checkLineComplete(puzzleSolution[i], updatedPuzzle[i]);
    if (!gameComplete) {
      return false;
    }
  }
  return true;
}

/**
 * @returns Whether or not a line contains only FILL_STATE.FILLED
 */
export const checkLineFilled = (line: string[]): boolean => {
  const lineItems = new Set(line);
  if (lineItems.size === 1 && lineItems.has(FILL_STATE.FILLED)) {
    return true;
  }
  return false;
}

/**
 * @returns Whether or not the lives have reached 0
 */
export const checkGameOver = (lives: number): boolean => {
  return lives === 0 ? true : false;
}

/**
 * A Tile is considered fillable only when it contains FILL_STATE.EMPTY
 *
 * @returns Whether or not a tile can be filled
 */
export const checkTileFillable = (fill: string): boolean => {
  return fill === FILL_STATE.EMPTY ? true : false;
}

/**
 * A Tile is considered markable only when it contains FILL_STATE MARKED or EMPTY
 *
 * @returns Whether or not a tile can be marked
 */
export const checkTileMarkable = (fill: string): boolean => {
  switch (true) {
    case fill === FILL_STATE.EMPTY:
    case fill === FILL_STATE.MARKED:
      return true;

    default:
      return false;
  }
}

/**
 * Used to determine the number of lives the game starts out with
 *
 * @returns The length of the inputPuzzles' longest side
 */
export const getLongestDimension = <T>(inputPuzzle: T[][]): number => {
  return inputPuzzle.length >= inputPuzzle[0].length ? inputPuzzle.length : inputPuzzle[0].length;
}

/**
 * Used to determine how many hints a line could potentially have, based on the length of the line
 *
 * @returns The maximum number of hints possible for a given line
 */
export const getMaxHintCountByLineLength = (lineLength: number): number => {
  return Math.ceil(lineLength / 2);
}