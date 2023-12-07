/* ---- Imports Section */
import React, { useState, useEffect, useReducer } from 'react';
// Constants
import { FILL_STATE } from 'constants/fillState';
// Functions
import { copyCurrentPuzzle } from 'functions/puzzleSetup';
import { checkLineComplete, checkPuzzleComplete, checkTileFillable, checkTileMarkable, getColumn } from 'functions/getPuzzleInfo';
/* End ---- */

/* ---- Fill & Associated Functions */
// fillTile determines whether the clicked tile should receive FILL_STATE.FILLED or FILL_STATE.ERROR
// It returns an object with information on what changes fillTile made to the puzzle
// The updatedPuzzle itself, whether a tile was given FILLED or ERROR, & whether or not the game is now complete
interface FillTileReturn {
  puzzle: string[][],
  tileFilled: boolean | null,
  gameComplete: boolean
}

export const fillTile = (puzzleSolution: boolean[][], currentPuzzle: string[][], rowIndex: number, colIndex: number): FillTileReturn => {
  if (!checkTileFillable(currentPuzzle[rowIndex][colIndex])) {
    // tileFilled === null is a catch for attempts to fill an unfillable tile ( checkTileFillable returned false & no updates to the puzzle were made )
    // Don't need to worry about accidental changes to gameComplete as the useReducer function will return due to tileFilled === null before it has a chance to update the gameComplete state
    return {
      puzzle: currentPuzzle,
      tileFilled: null,
      gameComplete: false
    };
  }

  let updatedPuzzle = copyCurrentPuzzle(currentPuzzle);
  let tileFilled = false;
  let gameComplete = false;

  if (puzzleSolution[rowIndex][colIndex]) {
    updatedPuzzle[rowIndex][colIndex] = FILL_STATE.FILLED;
    const updatedPuzzleLineOrGameCompleteData = checkFillCompletesLineOrGame(puzzleSolution, updatedPuzzle, rowIndex, colIndex);

    updatedPuzzle = updatedPuzzleLineOrGameCompleteData.puzzle;
    tileFilled = true;
    gameComplete = updatedPuzzleLineOrGameCompleteData.gameComplete;
  } else {
    updatedPuzzle[rowIndex][colIndex] = FILL_STATE.ERROR;
  }

  return {
    puzzle: updatedPuzzle,
    tileFilled: tileFilled,
    gameComplete: gameComplete
  };
}

interface CheckFillCompletesLineOrGameReturn {
  puzzle: string[][],
  gameComplete: boolean
}

const checkFillCompletesLineOrGame = (puzzleSolution: boolean[][], updatedPuzzle: string[][], rowIndex: number, colIndex: number): CheckFillCompletesLineOrGameReturn => {
  // Check if filling the tile completed the column and / or row it's in
  const colLineComplete = checkLineComplete(getColumn(puzzleSolution, colIndex), getColumn(updatedPuzzle, colIndex));
  const rowLineComplete = checkLineComplete(puzzleSolution[rowIndex], updatedPuzzle[rowIndex]);

  // If line is complete, set all empty or marked tiles to complete
  if (colLineComplete) {
    updatedPuzzle = setColComplete(updatedPuzzle, colIndex);
  }
  if (rowLineComplete) {
    updatedPuzzle = setRowComplete(updatedPuzzle, rowIndex);
  }
  // Only need to check for game completion if both a column & row were completed by this tile being filled
  let gameComplete = false;
  if (colLineComplete && rowLineComplete) {
    // move check to reducer
    gameComplete = checkPuzzleComplete(puzzleSolution, updatedPuzzle);
  }
  return {
    puzzle: updatedPuzzle,
    gameComplete: gameComplete
  };
}

/* ---- Tile Interaction Trigger Hint Change Functions */
// If line complete, set remaining tiles in column / row to complete
// This is only set for lines in which every fillable tile has been filled, specifically NOT for lines with 0 fillable tiles or incomplete lines
// Lines with 0 fillable tiles are all marked error on puzzle initialization
// Lines with some completed hints do not trigger this, even in obvious cases such as first / last hint completion
// This keeps in line with existing nonogram puzzles; avoids holding users' hand too much
// In this puzzle, fillState.complete is set up to specifically disallow removal unlike many other nonogram puzzles as that feels unfair for a user to be able to accidentally undo their own progress ( in a sense ) & trigger errors on lines they have already solved
const setColComplete = (updatedPuzzle: string[][], colIndex: number): string[][] => {
  for (let i = 0; i < updatedPuzzle.length; i++) {
    if (updatedPuzzle[i][colIndex] === FILL_STATE.EMPTY || updatedPuzzle[i][colIndex] === FILL_STATE.MARKED) {
      // fillState.complete matches fillState.marked visually, but cannot be removed
      updatedPuzzle[i][colIndex] = FILL_STATE.COMPLETE;
    }
  }
  return updatedPuzzle;
}

const setRowComplete = (updatedPuzzle: string[][], rowIndex: number): string[][] => {
  for (let i = 0; i < updatedPuzzle[0].length; i++) {
    if (updatedPuzzle[rowIndex][i] === FILL_STATE.EMPTY || updatedPuzzle[rowIndex][i] === FILL_STATE.MARKED) {
      // fillState.complete matches fillState.marked visually, but cannot be removed
      updatedPuzzle[rowIndex][i] = FILL_STATE.COMPLETE;
    }
  }
  return updatedPuzzle;
}
/* End of Fill & associated functions ---- */

// Marking a tile, marked tiles can be unmarked by clicking on them again
export const markTile = (currentPuzzle: string[][], rowIndex: number, colIndex: number) => {
  if (!checkTileMarkable(currentPuzzle[rowIndex][colIndex])) {
    return currentPuzzle;
  }

  const updatedPuzzle = copyCurrentPuzzle(currentPuzzle);
  updatedPuzzle[rowIndex][colIndex] = updatedPuzzle[rowIndex][colIndex] === FILL_STATE.EMPTY ? FILL_STATE.MARKED : FILL_STATE.EMPTY;
  return updatedPuzzle;
}

// Hovering over a tile highlights it & its' corresponding column / row hints
export const hoverTile = (e: React.MouseEvent, rowIndex: number, colIndex: number): void => {
  const hoverRow = document.querySelector(`.rowInfo${rowIndex}`);
  const hoverCol = document.querySelector(`.colInfo${colIndex}`);

  if (hoverRow === null || hoverCol === null) {
    return;
  }
  if (e.type === 'mouseenter') {
    hoverRow.classList.add('hoverInfo');
    hoverCol.classList.add('hoverInfo');
  }
  if (e.type === 'mouseleave') {
    hoverRow.classList.remove('hoverInfo');
    hoverCol.classList.remove('hoverInfo');
  }
}

export const resetInfoTiles = <T>(inputPuzzle: T[][]): void => {
  for (let i = 0; i < inputPuzzle.length; i++) {
    const rowInfo = document.querySelector(`.rowInfo${i}`);
    if (rowInfo !== null) {
      rowInfo.classList.remove('completeLineHint');
    }
  }
  for (let i = 0; i < inputPuzzle[0].length; i++) {
    const colInfo = document.querySelector(`.colInfo${i}`);
    if (colInfo !== null) {
      colInfo.classList.remove('completeLineHint');
    }
  }
}