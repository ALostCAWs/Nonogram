
/* ---- Imports Section */
import { fillState } from "../state.ts";
/* End ---- */

/* ---- Validity Check Functions */
// Very basic check, only ensures at least one tile is to be filled in
// Doesn't account for ensuring a puzzle doesn't have multiple feasible solutions based on the hints that will be generated in order to solve it
export const checkSolutionNotBlank = (gameSolution: boolean[][]): boolean => {
  for (let i = 0; i < gameSolution.length; i++) {
    if (gameSolution[i].includes(true)) {
      return true;
    }
  }
  return false;
}

export const checkBoardNotBlank = (currentGame: string[][]): boolean => {
  for (let i = 0; i < currentGame.length; i++) {
    if (currentGame[i].includes(fillState.filled)) {
      return true;
    }
  }
  return false;
}

export const checkGameRectangular = (gameSolution: boolean[][]): boolean => {
  // Ensure all row lengths are equal to the length of the first row
  // Only have to check against the first row due to the import method slicing row by row based on the given width
  // Only have to check rows as unequal columns result in unequal rows & vice-versa
  let rowLengthToEnforce = gameSolution[0].length;
  for (let i = 1; i < gameSolution.length; i++) {
    if (rowLengthToEnforce !== gameSolution[i].length) {
      return false;
    }
  }
  return true;
}

/* ---- Completion Check Functions  */
// Check if a given column / row is complete & returns bool
export const checkLineComplete = (gameSolutionLine: boolean[], updatedGameLine: string[]): boolean => {
  for (let i = 0; i < gameSolutionLine.length; i++) {
    if (gameSolutionLine[i] && updatedGameLine[i] !== fillState.filled) {
      return false;
    }
  }
  return true;
}

// Check each column & row for completion, break the search as soon as an incomplete line is found
export const checkGameComplete = (gameSolution: boolean[][], updatedGame: string[][]): boolean => {
  for (let i = 0; i < gameSolution.length; i++) {
    let gameComplete = checkLineComplete(getColumn(gameSolution, i), getColumn(updatedGame, i));
    if (!gameComplete) {
      return false;
    }
    gameComplete = checkLineComplete(gameSolution[i], updatedGame[i]);
    if (!gameComplete) {
      return false;
    }
  }
  return true;
}

export const checkGameOver = (lives: number): boolean => {
  return lives === 0 ? true : false;
}

/* ---- Tile Check */
export const checkTileFillable = (fill: string): boolean => {
  return fill === fillState.empty ? true : false;
}

export const checkTileMarkable = (fill: string): boolean => {
  switch (true) {
    case fill === fillState.empty:
    case fill === fillState.marked:
      return true;

    default:
      return false;
  }
}

/* ---- Column Quality of Life */
export const getColumn = <T>(inputGame: T[][], colIndex: number): T[] => {
  let column: T[] = [];
  for (let i = 0; i < inputGame.length; i++) {
    column.push(inputGame[i][colIndex]);
  }
  return column;
}

export const getGameByColumn = <T>(inputGame: T[][]): T[][] => {
  let gameByColumn: T[][] = [];
  for (let i = 0; i < inputGame[0].length; i++) {
    let column: T[] = getColumn(inputGame, i);
    gameByColumn.push(column);
  }
  return gameByColumn;
}

/* ---- Longest Dimension */
export const getLongestDimension = <T>(inputGame: T[][]): number => {
  return inputGame.length >= inputGame[0].length ? inputGame.length : inputGame[0].length;
}

/* ---- Max Number of Hints */
// Based on the length of the line
export const getMaxHintCountByLineLength = (lineLength: number): number => {
  return Math.ceil(lineLength / 2);
}