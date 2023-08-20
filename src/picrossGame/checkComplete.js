
/* ---- Imports Section */
import { fillState } from './picrossProvider';
import { getColumn } from './getBoardInfo';
/* End ---- */

/* ---- Completion Check Functions  */
// Check if a given column / row is complete & returns bool
export const checkLineComplete = (gameSolutionLine, updatedGameLine) => {
  let lineComplete = true;
  gameSolutionLine.forEach((tile, i) => {
    if (tile && updatedGameLine[i] !== fillState.filled) {
      lineComplete = false;
    }
  });
  return lineComplete;
}

// Check each column & row for completion, break the search as soon as an incomplete line is found
export const checkGameComplete = (gameSolution, updatedGame) => {
  let gameComplete = true;
  for (let i = 0; i < gameSolution.length; i++) {
    gameComplete = checkLineComplete(getColumn(gameSolution, i), getColumn(updatedGame, i));
    if (!gameComplete) {
      break;
    }
    gameComplete = checkLineComplete(gameSolution[i], updatedGame[i]);
    if (!gameComplete) {
      break;
    }
  }
  return gameComplete;
}