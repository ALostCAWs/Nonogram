import { FILL_STATE } from "constants/fillState";
import { TileState } from "interfaces/tileState";
import { convertTileStateLineToStringLine } from "./convertPuzzle";

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
 * A line is considered complete when all the tiles in currentPuzzleLine that are true in puzzleSolutionLine have been filled
 *
 * @returns Whether a given column / row is complete
 */
export const checkLineComplete = (puzzleSolutionLine: boolean[], currentPuzzleLine: TileState[]): boolean => {
  for (let i = 0; i < puzzleSolutionLine.length; i++) {
    if (puzzleSolutionLine[i] && currentPuzzleLine[i].fill !== FILL_STATE.FILLED) {
      return false;
    }
  }
  return true;
}

/**
 * A puzzle is considered complete when all the tiles in currentPuzzle that are true in puzzleSolution have been filled
 *
 * @returns Whether or not a puzzle has been solved
 */
export const checkPuzzleComplete = (puzzleSolution: boolean[][], updatedPuzzle: TileState[][]): boolean => {
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
export const checkLineFilled = (line: TileState[]): boolean => {
  const lineItems = new Set(convertTileStateLineToStringLine(line));
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
export const checkTileFillable = (tile: TileState): boolean => {
  return tile.fill === FILL_STATE.EMPTY ? true : false;
}

/**
 * A Tile is considered markable only when it contains FILL_STATE MARKED or EMPTY
 *
 * @returns Whether or not a tile can be marked
 */
export const checkTileMarkable = (tile: TileState): boolean => {
  switch (true) {
    case tile.fill === FILL_STATE.EMPTY:
    case tile.fill === FILL_STATE.MARKED:
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