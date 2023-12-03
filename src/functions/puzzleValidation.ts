/* ---- Imports Section */
import { fillState } from "constants/fillState";
/* End ---- */

/* ---- Validity Check Functions */
// Very basic check, only ensures at least one tile is to be filled in
// Doesn't account for ensuring a puzzle doesn't have multiple feasible solutions based on the hints that will be generated in order to solve it
export const checkSolutionNotBlank = (puzzleSolution: boolean[][]): boolean => {
  for (let i = 0; i < puzzleSolution.length; i++) {
    if (puzzleSolution[i].includes(true)) {
      return true;
    }
  }
  return false;
}

export const checkBoardNotBlank = (currentPuzzle: string[][]): boolean => {
  for (let i = 0; i < currentPuzzle.length; i++) {
    if (currentPuzzle[i].includes(fillState.filled)) {
      return true;
    }
  }
  return false;
}

export const checkPuzzleRectangular = (puzzleSolution: boolean[][]): boolean => {
  // Ensure all row lengths are equal to the length of the first row
  // Only have to check against the first row due to the import method slicing row by row based on the given width
  // Only have to check rows as unequal columns result in unequal rows & vice-versa
  const rowLengthToEnforce = puzzleSolution[0].length;
  for (let i = 1; i < puzzleSolution.length; i++) {
    if (rowLengthToEnforce !== puzzleSolution[i].length) {
      return false;
    }
  }
  return true;
}