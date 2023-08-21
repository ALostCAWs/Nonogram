
/* ---- Imports Section */
import { fillState } from "../state/state";
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

/* ---- Get Column */
export const getColumn = (inputGame, colIndex) => {
  let column = [];
  for (let i = 0; i < inputGame.length; i++) {
    column.push(inputGame[i][colIndex]);
  }
  return column;
}