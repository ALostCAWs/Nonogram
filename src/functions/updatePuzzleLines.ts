import { copyCurrentPuzzle } from "./puzzleSetup";

/**
 * Sets a given rows' tiles in currentPuzzle to the specified FILL_STATE
 */
export const setTileRowFillState = (currentPuzzle: string[][], rowIndex: number, fill: string): string[][] => {
  const updatedPuzzle = copyCurrentPuzzle(currentPuzzle);
  for (let i = 0; i < updatedPuzzle[0].length; i++) {
    updatedPuzzle[rowIndex][i] = fill;
  }
  return updatedPuzzle;
}
/**
 * Sets a given columns' tiles in currentPuzzle to the specified FILL_STATE
*/
export const setTileColFillState = (currentPuzzle: string[][], colIndex: number, fill: string): string[][] => {
  const updatedPuzzle = copyCurrentPuzzle(currentPuzzle);
  for (let i = 0; i < updatedPuzzle.length; i++) {
    updatedPuzzle[i][colIndex] = fill;
  }
  return updatedPuzzle;
}