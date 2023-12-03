/* ---- Imports Section */
import { fillState } from "constants/fillState";
/* End ---- */

/* ---- Column Quality of Life */
export const getColumn = <T>(inputPuzzle: T[][], colIndex: number): T[] => {
  const column: T[] = [];
  for (let i = 0; i < inputPuzzle.length; i++) {
    column.push(inputPuzzle[i][colIndex]);
  }
  return column;
}

export const getPuzzleByColumn = <T>(inputPuzzle: T[][]): T[][] => {
  const puzzleByColumn: T[][] = [];
  for (let i = 0; i < inputPuzzle[0].length; i++) {
    const column: T[] = getColumn(inputPuzzle, i);
    puzzleByColumn.push(column);
  }
  return puzzleByColumn;
}

/* ---- Completion Check Functions  */
// Check if a given column / row is complete & returns bool
export const checkLineComplete = (puzzleSolutionLine: boolean[], updatedPuzzleLine: string[]): boolean => {
  for (let i = 0; i < puzzleSolutionLine.length; i++) {
    if (puzzleSolutionLine[i] && updatedPuzzleLine[i] !== fillState.filled) {
      return false;
    }
  }
  return true;
}

// Check each column & row for completion, break the search as soon as an incomplete line is found
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

/* ---- Longest Dimension */
export const getLongestDimension = <T>(inputPuzzle: T[][]): number => {
  return inputPuzzle.length >= inputPuzzle[0].length ? inputPuzzle.length : inputPuzzle[0].length;
}

/* ---- Max Number of Hints */
// Based on the length of the line
export const getMaxHintCountByLineLength = (lineLength: number): number => {
  return Math.ceil(lineLength / 2);
}