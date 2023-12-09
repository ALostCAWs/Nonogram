import React from 'react';
import { FILL_STATE } from 'constants/fillState';
import { TileState } from 'interfaces/tileState';
import { copyCurrentPuzzle } from 'functions/puzzleSetup';
import { checkLineComplete, checkPuzzleComplete, checkTileFillable, checkTileMarkable, getColumn } from 'functions/getPuzzleInfo';

interface FillTileResult {
  puzzle: TileState[][],
  tileFilled: boolean | null,
  gameComplete: boolean
}

/**
 * fillTile determines whether the clicked tile should receive FILL_STATE.FILLED or FILL_STATE.ERROR
 * It returns an object with information on what changes fillTile made to the puzzle
 * The updatedPuzzle itself, whether a tile was given FILLED or ERROR, & whether or not the game is now complete
 *
 * tileFilled === null is a catch for attempts to fill an unfillable tile ( checkTileFillable returned false & no updates to the puzzle were made )
 * Don't need to consider changes to gameComplete as the useReducer function will return due to tileFilled === null before it has a chance to update the gameComplete state
 *
 * @returns updatedPuzzleData - Object containing the updatedPuzzle & info about the updates made
 * @returns updatedPuzzle
 * @returns tileFilled
 * @returns gameComplete
 */
export const fillTile = (puzzleSolution: boolean[][], currentPuzzle: TileState[][], rowIndex: number, colIndex: number): FillTileResult => {
  if (!checkTileFillable(currentPuzzle[rowIndex][colIndex])) {
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
    updatedPuzzle[rowIndex][colIndex].fill = FILL_STATE.FILLED;
    const updatedPuzzleLineOrGameCompleteData = checkFillCompletesLineOrGame(puzzleSolution, updatedPuzzle, rowIndex, colIndex);

    updatedPuzzle = updatedPuzzleLineOrGameCompleteData.puzzle;
    tileFilled = true;
    gameComplete = updatedPuzzleLineOrGameCompleteData.gameComplete;
  } else {
    updatedPuzzle[rowIndex][colIndex].fill = FILL_STATE.ERROR;
  }

  return {
    puzzle: updatedPuzzle,
    tileFilled: tileFilled,
    gameComplete: gameComplete
  };
}

interface CheckFillCompletesLineOrGameResult {
  puzzle: TileState[][],
  gameComplete: boolean
}

/**
 * Checks if the row & column a filled tile is in was completed as a result of the fill
 * If a given line was complete, all non FILL_STATE FILLED / ERROR tiles are set to FILL_STATE.COMPLETE
 * Runs a check for game completion only if both the row & column the tile was in were completed as a result of the fill
 *
 * @returns updatedPuzzleLineOrGameCompleteData - Object containing the updatedPuzzle & info about the updates made
 * @returns updatedPuzzle
 * @returns gameComplete
 */
const checkFillCompletesLineOrGame = (puzzleSolution: boolean[][], updatedPuzzle: TileState[][], rowIndex: number, colIndex: number): CheckFillCompletesLineOrGameResult => {
  // Check if filling the tile completed the column and / or row it's in
  const colLineComplete = checkLineComplete(getColumn(puzzleSolution, colIndex), getColumn(updatedPuzzle, colIndex));
  const rowLineComplete = checkLineComplete(puzzleSolution[rowIndex], updatedPuzzle[rowIndex]);

  if (colLineComplete) {
    updatedPuzzle = setColComplete(updatedPuzzle, colIndex);
  }
  if (rowLineComplete) {
    updatedPuzzle = setRowComplete(updatedPuzzle, rowIndex);
  }

  let gameComplete = false;
  if (colLineComplete && rowLineComplete) {
    gameComplete = checkPuzzleComplete(puzzleSolution, updatedPuzzle);
  }
  return {
    puzzle: updatedPuzzle,
    gameComplete: gameComplete
  };
}

/**
 * If line complete, set remaining tiles in row to complete
 * This is only set for lines in which every fillable tile has been filled, specifically NOT for lines with 0 fillable tiles or incomplete lines
 * Lines with 0 fillable tiles are all marked error on puzzle initialization
 * Lines with some completed hints do not trigger this, even in obvious cases such as first / last hint completion
 * This keeps in line with existing nonogram puzzles; avoids holding users' hand too much
 * In this puzzle, FILL_STATE.COMPLETE is set up to specifically disallow removal unlike many other nonogram puzzles as that feels unfair for a user to be able to accidentally undo their own progress ( in a sense ) & trigger errors on lines they have already solved
 *
 * @returns updatedPuzzle with any completed rows having their FILL_STATE EMPTY / MARKED set to FILL_STATE.COMPLETE
 */
const setRowComplete = (updatedPuzzle: TileState[][], rowIndex: number): TileState[][] => {
  for (let i = 0; i < updatedPuzzle[0].length; i++) {
    if (updatedPuzzle[rowIndex][i].fill === FILL_STATE.EMPTY || updatedPuzzle[rowIndex][i].fill === FILL_STATE.MARKED) {
      // FILL_STATE.COMPLETE matches FILL_STATE.MARKED visually, but cannot be removed
      updatedPuzzle[rowIndex][i].fill = FILL_STATE.COMPLETE;
    }
  }
  return updatedPuzzle;
}

/**
 * If line complete, set remaining tiles in column to complete
 * This is only set for lines in which every fillable tile has been filled, specifically NOT for lines with 0 fillable tiles or incomplete lines
 * Lines with 0 fillable tiles are all marked error on puzzle initialization
 * Lines with some completed hints do not trigger this, even in obvious cases such as first / last hint completion
 * This keeps in line with existing nonogram puzzles; avoids holding users' hand too much
 * In this puzzle, FILL_STATE.COMPLETE is set up to specifically disallow removal unlike many other nonogram puzzles as that feels unfair for a user to be able to accidentally undo their own progress ( in a sense ) & trigger errors on lines they have already solved
 *
 * @returns updatedPuzzle with any completed columns having their FILL_STATE EMPTY / MARKED set to FILL_STATE.COMPLETE
 */
const setColComplete = (updatedPuzzle: TileState[][], colIndex: number): TileState[][] => {
  for (let i = 0; i < updatedPuzzle.length; i++) {
    if (updatedPuzzle[i][colIndex].fill === FILL_STATE.EMPTY || updatedPuzzle[i][colIndex].fill === FILL_STATE.MARKED) {
      // FILL_STATE.COMPLETE matches FILL_STATE.MARKED visually, but cannot be removed
      updatedPuzzle[i][colIndex].fill = FILL_STATE.COMPLETE;
    }
  }
  return updatedPuzzle;
}

/**
 * @returns Tile markable & tiles' original FILL_STATE MARKED / EMPTY - puzzle with a given tile now set to FILL_STATE MARKED / EMPTY
 * @returns Tile markable & tiles' original not FILL_STATE MARKED / EMPTY - puzzle with no changes
 * @returns Tile unmarkable - puzzle with no changes
 */
export const markTile = (currentPuzzle: TileState[][], rowIndex: number, colIndex: number) => {
  let tile = currentPuzzle[rowIndex][colIndex];
  if (!checkTileMarkable(tile)) {
    return currentPuzzle;
  }

  const updatedPuzzle = copyCurrentPuzzle(currentPuzzle);
  tile = updatedPuzzle[rowIndex][colIndex];
  updatedPuzzle[rowIndex][colIndex].fill = tile.fill === FILL_STATE.EMPTY ? FILL_STATE.MARKED : FILL_STATE.EMPTY;
  return updatedPuzzle;
}

/**
 * Hovering over a tile highlights it & its' corresponding column / row hints
 */
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

/**
 * Used to set all InfoTile components back to their original state on game reset
 */
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