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
// when column / row complete, check for overall game completion
// add lives, lose life when error is made, game end when complete or all lives lost

// Knows the gameSolution ( can be passed to board, maybe not needed though )
// Secondary currentGame, same size as gameSolution, manages the users' progress
// Tiles use callbacks to functions within when onClick / onContextMenu
// When tile filled, PicrossProvider checks for column / row completion
// currentGame passed to Board, making Board purely for displaying
export const PicrossProvider = ({ gameSolution }) => {
  console.log('---');
  const [currentGame, setCurrentGame] = useState(CreateCurrentGame(gameSolution));

  // useEffect triggers on first render to set any columns / rows with no fillable tiles to fillState.error
  // Keeps in line with existing picross games
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
  const setTileColZero = (colIndex, currentGame) => {
    for (let i = 0; i < currentGame.length; i++) {
      currentGame[i][colIndex] = fillState.error;
    }
  }
  const setTileRowZero = (rowIndex, currentGame) => {
    for (let i = 0; i < currentGame[0].length; i++) {
      currentGame[rowIndex][i] = fillState.error;
    }
  }

  /* ---- Tile Interaction Functions */
  // R-click to attempt fill, fillState.filled & fillState.error are not removable
  const fillTile = (e, rowIndex, colIndex) => {
    let updatedGame = CopyCurrentGame(currentGame);
    if (currentGame[rowIndex][colIndex] !== fillState.empty) {
      return;
    }
    if (gameSolution[rowIndex][colIndex]) {
      updatedGame[rowIndex][colIndex] = fillState.filled;

      // Check if filling the tile completed the column and / or row it's in
      const colLineComplete = checkLineComplete(GetColumn(gameSolution, colIndex), GetColumn(updatedGame, colIndex), colIndex);
      const rowLineComplete = checkLineComplete(gameSolution[rowIndex], updatedGame[rowIndex], rowIndex);

      // If line is complete, set all empty or marked tiles to complete
      if (colLineComplete) {
        updatedGame = setColComplete(updatedGame, colIndex);
      }
      if (rowLineComplete) {
        updatedGame = setRowComplete(updatedGame, rowIndex);
      }
    } else {
      updatedGame[rowIndex][colIndex] = fillState.error;
    }
    setCurrentGame(updatedGame);
  }
  // L-click to mark ( used as a removable penalty-free reference )
  const markTile = (e, rowIndex, colIndex) => {
    e.preventDefault();
    let updatedGame = CopyCurrentGame(currentGame);
    if (currentGame[rowIndex][colIndex] === fillState.empty) {
      updatedGame[rowIndex][colIndex] = fillState.marked;
    } else if (currentGame[rowIndex][colIndex] === fillState.marked) {
      updatedGame[rowIndex][colIndex] = fillState.empty;
    }
    setCurrentGame(updatedGame);
  }
  const hoverTile = (e, rowIndex, colIndex) => {
    const hoverRow = document.querySelector(`.rowHint${rowIndex}`);
    const hoverCol = document.querySelector(`.colHint${colIndex}`);
    if (e.type === 'mouseenter') {
      hoverRow.classList.add('hoverHint');
      hoverCol.classList.add('hoverHint');
    }
    if (e.type === 'mouseleave') {
      hoverRow.classList.remove('hoverHint');
      hoverCol.classList.remove('hoverHint');
    }
  }

  /* ---- Tile Interaction Trigger Hint Change Functions */
  // Check if a given column / row is complete & returns bool
  // If TRUE, set remaining tiles in column / row to complete
  // This is only set for lines in which every fillable tile has been filled, specifically NOT for lines with 0 fillable tiles or incomplete lines
  // Lines with 0 fillable tiles are all marked error on game initialization
  // Lines with some completed hints do not trigger this, even in obvious cases such as first / last hint completion
  // This keeps in line with existing picross games; avoids holding users' hand too much
  // In this game, fillState.complete is set up to specifically disallow removal unlike many other picross games as that feels unfair for a user to be able to accidentally undo their own progress ( in a sense ) & trigger errors on lines they have already solved
  const checkLineComplete = (gameSolutionLine, updatedGameLine) => {
    let lineComplete = true;
    gameSolutionLine.forEach((tile, i) => {
      if (tile && updatedGameLine[i] !== fillState.filled) {
        lineComplete = false;
      }
    });
    return lineComplete;
  }
  const setColComplete = (updatedGame, colIndex) => {
    for (let i = 0; i < currentGame.length; i++) {
      if (updatedGame[i][colIndex] === fillState.empty || updatedGame[i][colIndex] === fillState.marked) {
        // fillState.complete matches fillState.marked visually, but cannot be removed
        updatedGame[i][colIndex] = fillState.complete;
      }
    }
    return updatedGame;
  }
  const setRowComplete = (updatedGame, rowIndex) => {
    for (let i = 0; i < updatedGame[0].length; i++) {
      if (updatedGame[rowIndex][i] === fillState.empty || updatedGame[rowIndex][i] === fillState.marked) {
        // fillState.complete matches fillState.marked visually, but cannot be removed
        updatedGame[rowIndex][i] = fillState.complete;
      }
    }
    return updatedGame;
  }

  console.log(currentGame);
  return (
    <>
      <Board currentGame={currentGame} gameSolution={gameSolution} fillTile={fillTile} markTile={markTile} hoverTile={hoverTile} />
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