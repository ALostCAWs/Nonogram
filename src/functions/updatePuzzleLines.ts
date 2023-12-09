import { TileState } from "interfaces/tileState";
import { copyCurrentPuzzle } from "./puzzleSetup";

/**
 * Sets a given rows' tiles in currentPuzzle to the specified FILL_STATE
 */
export const setTileRowFillState = (currentPuzzle: TileState[][], rowIndex: number, fill: string): TileState[][] => {
  const updatedPuzzle = copyCurrentPuzzle(currentPuzzle);
  for (let i = 0; i < updatedPuzzle[0].length; i++) {
    updatedPuzzle[rowIndex][i].fill = fill;
  }
  return updatedPuzzle;
}
/**
 * Sets a given columns' tiles in currentPuzzle to the specified FILL_STATE
*/
export const setTileColFillState = (currentPuzzle: TileState[][], colIndex: number, fill: string): TileState[][] => {
  const updatedPuzzle = copyCurrentPuzzle(currentPuzzle);
  for (let i = 0; i < updatedPuzzle.length; i++) {
    updatedPuzzle[i][colIndex].fill = fill;
  }
  return updatedPuzzle;
}