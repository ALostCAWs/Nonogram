/* ---- Imports Section */
import React, { useEffect, useState } from 'react';
import { Board } from './board';
import { GetColumn } from './getBoardInfo';
/* End ---- */

/* ---- Enums for state */
export const fillState = {
  empty: '',
  filled: 'filled',
  error: 'error',
  marked: 'marked',
  complete: 'marked complete'
};
export const hintState = {
  incomplete: '',
  fullLineIncomplete: 'fullLineIncomplete',
  zero: 'zeroHint',
  complete: 'completeHint'
};

// TODO:
// highlight tile onhover
// highlight faintly row / col of tile onhover

// Get hints
// Knows the gameSolution ( can be passed to board, maybe not needed though )
// Secondary currentGame, same size as gameSolution, manages the users' progress
// Tiles use callbacks to functions within when onClick / onContextMenu
// currentGame passed to Board, making Board purely for displaying
export const PicrossProvider = ({ gameSolution }) => {
  console.log('---');
  const [currentGame, setCurrentGame] = useState(CreateCurrentGame(gameSolution));

  useEffect(() => {
    // Reset currentGame when useEffect triggered ( don't keep prev. zero hint error lines )
    let updatedGame = CreateCurrentGame(gameSolution);

    // Find zero hint lines ( rows and/or columns ) & pass to functions to set fillState.error
    for (let i = 0; i < gameSolution.length; i++) {
      let col = new Set(GetColumn(gameSolution, i));
      if (col.size === 1 && col.has(false)) {
        setTileColZero(i, updatedGame);
      }
    }
    for (let i = 0; i < gameSolution[0].length; i++) {
      let row = new Set(gameSolution[i]);
      if (row.size === 1 && row.has(false)) {
        setTileRowZero(i, updatedGame);
      }
    }
    // Call setCurrentGame once to avoid issues
    setCurrentGame(updatedGame);
  }, [gameSolution]);

  /* ---- Initial Game Setup Functions */
  // Functions to set all tiles in zero hint lines ( rows and/or columns ) to fillState.error
  const setTileColZero = (index, currentGame) => {
    for (let i = 0; i < currentGame.length; i++) {
      currentGame[i][index] = fillState.error;
    }
  }
  const setTileRowZero = (index, currentGame) => {
    for (let i = 0; i < currentGame.length; i++) {
      currentGame[index][i] = fillState.error;
    }
  }

  /* ---- Tile Interaction Functions */
  // R-click to attempt fill
  const fillTile = (e, row, col) => {
    let updatedGame = CopyCurrentGame(currentGame);
    if (currentGame[row][col] !== fillState.empty) {
      return;
    }
    if (gameSolution[row][col]) {
      updatedGame[row][col] = fillState.filled;
    } else {
      updatedGame[row][col] = fillState.error;
    }
    setCurrentGame(updatedGame);
  }
  // L-click to mark ( used as penalty-free reference )
  const markTile = (e, row, col) => {
    e.preventDefault();
    let updatedGame = CopyCurrentGame(currentGame);
    if (currentGame[row][col] === fillState.empty) {
      updatedGame[row][col] = fillState.marked;
    } else if (currentGame[row][col] === fillState.marked) {
      updatedGame[row][col] = fillState.empty;
    }
    setCurrentGame(updatedGame);
  }
  console.log(currentGame);
  return (
    <>
      <Board currentGame={currentGame} gameSolution={gameSolution} fillTile={fillTile} markTile={markTile} />
    </>
  );
}

/* ---- Create / Copy currentGame  */
/* Used only by PicrossProvider */
const CreateCurrentGame = (gameSolution) => {
  let currentGame = [];
  for (let i = 0; i < gameSolution.length; i++) {
    currentGame[i] = [];
    for (let j = 0; j < gameSolution[i].length; j++) {
      currentGame[i][j] = fillState.empty;
    }
  }
  return currentGame;
}

// A simple assignment failed to trigger a re-render due to the arrays referencing the same point in memory
const CopyCurrentGame = (currentGame) => {
  let gameCopy = [];
  for (let i = 0; i < currentGame.length; i++) {
    gameCopy[i] = [];
    for (let j = 0; j < currentGame[i].length; j++) {
      gameCopy[i][j] = currentGame[i][j];
    }
  }
  return gameCopy;
}