import { FILL_STATE } from "constants/fillState";

/**
 * Very basic check, only ensures at least one tile is to be filled in
 * Doesn't account for ensuring a puzzle doesn't have multiple feasible solutions based on the hints that will be generated in order to solve it
 *
 * @returns Whether or not a puzzleSolution contains at least one true
 */
export const checkSolutionNotBlank = (puzzleSolution: boolean[][]): boolean => {
  for (let i = 0; i < puzzleSolution.length; i++) {
    if (puzzleSolution[i].includes(true)) {
      return true;
    }
  }
  return false;
}

/**
 * @returns Whether ot not a currentPuzzle contains at least one FILL_STATE.FILLED
 */
export const checkBoardNotBlank = (currentPuzzle: string[][]): boolean => {
  for (let i = 0; i < currentPuzzle.length; i++) {
    if (currentPuzzle[i].includes(FILL_STATE.FILLED)) {
      return true;
    }
  }
  return false;
}

/**
 * Ensure all row lengths are equal to the length of the first row
 * Only have to check against the first row due to the import method slicing row by row based on the given width
 * Only have to check rows as unequal columns result in unequal rows & vice-versa
 *
 * @returns Whether or not a puzzleSolution is rectangular
 */
export const checkPuzzleRectangular = (puzzleSolution: boolean[][]): boolean => {
  const rowLengthToEnforce = puzzleSolution[0].length;
  for (let i = 1; i < puzzleSolution.length; i++) {
    if (rowLengthToEnforce !== puzzleSolution[i].length) {
      return false;
    }
  }
  return true;
}