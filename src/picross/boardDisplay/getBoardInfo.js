
/* ---- Imports Section */
import { fillState } from "../state";
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

/* ---- Validity Check Functions */
export const checkGameBlank = (inputGame) => {
  let gameBlank = true;
  for (let i = 0; i < inputGame[0].length; i++) {
    let col = new Set(getColumn(inputGame, i));
    if (gameBlank && (col.has(fillState.filled) || col.has(true))) {
      gameBlank = false;
      break;
    }
    console.log(gameBlank);
  }
  for (let i = 0; i < inputGame.length; i++) {
    let row = new Set(inputGame[i]);
    if (gameBlank && (row.has(fillState.filled) || row.has(true))) {
      gameBlank = false;
      break;
    }
    console.log(gameBlank);
  }
  return gameBlank;
}

export const checkGameRectangular = (inputGame) => {
  // Ensure all row lengths are equal to the length of the first row
  let gameRectangular = true;
  let rowLengthToEnforce = inputGame[0].length;
  for (let i = 1; i < inputGame.length; i++) {
    if (rowLengthToEnforce !== inputGame[i].length) {
      gameRectangular = false;
      break;
    }
  }
  return gameRectangular;
}

/* ---- Get Column */
export const getColumn = (inputGame, colIndex) => {
  let column = [];
  for (let i = 0; i < inputGame.length; i++) {
    column.push(inputGame[i][colIndex]);
  }
  return column;
}

export const getGameByColumn = (inputGame) => {
  console.log(inputGame);
  let gameByColumn = [];
  for (let i = 0; i < inputGame[0].length; i++) {
    let column = getColumn(inputGame, i);
    gameByColumn.push(column);
  }
  console.log(gameByColumn);
  return gameByColumn;
}

/* ---- Longest Dimension */
export const getLongestDimension = (inputGame) => {
  return inputGame.length >= inputGame[0].length ? inputGame.length : inputGame[0].length;
}

/* ---- Max Number of Hints */
// Based on the length of the line
export const getMaxHintCountByLineLength = (lineLength) => {
  return Math.ceil(lineLength / 2);
}