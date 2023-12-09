import { CurrentPuzzle } from "interfaces/currentPuzzle";
import { copyCurrentPuzzle } from "./puzzleSetup";

/**
 * Sets a given rows' tiles in currentPuzzle to the specified FILL_STATE
 */
export const setTileRowFillState = (currentPuzzle: CurrentPuzzle[][], rowIndex: number, fill: string): CurrentPuzzle[][] => {
  const updatedPuzzle = copyCurrentPuzzle(currentPuzzle);
  for (let i = 0; i < updatedPuzzle[0].length; i++) {
    updatedPuzzle[rowIndex][i].fill = fill;
  }
  return updatedPuzzle;
}
/**
 * Sets a given columns' tiles in currentPuzzle to the specified FILL_STATE
*/
export const setTileColFillState = (currentPuzzle: CurrentPuzzle[][], colIndex: number, fill: string): CurrentPuzzle[][] => {
  const updatedPuzzle = copyCurrentPuzzle(currentPuzzle);
  for (let i = 0; i < updatedPuzzle.length; i++) {
    updatedPuzzle[i][colIndex].fill = fill;
  }
  return updatedPuzzle;
}