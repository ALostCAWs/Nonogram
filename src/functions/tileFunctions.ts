import React from 'react';
import { FILL_STATE } from 'constants/fillState';
import { TileState } from 'interfaces/tileState';
import { FirstLastSelectedState } from 'interfaces/firstLastSelectedState';
import { copyCurrentPuzzle } from 'functions/puzzleSetup';
import { checkLineComplete, checkPuzzleComplete, checkTileFillable, checkTileMarkable, getColumn, getPuzzleByColumn } from 'functions/getPuzzleInfo';

/**
 * Sets the firstSelected state from the Provider component
 *
 * @returns A new matrix of the puzzle, with the onMouseDown tile.selected = true
 */
export const setFirstSelectedTile = (setFirstSelected: React.Dispatch<React.SetStateAction<FirstLastSelectedState>>, currentPuzzle: TileState[][], rowIndex: number, colIndex: number): TileState[][] => {
  setFirstSelected({ rowIndex: rowIndex, colIndex: colIndex });
  return currentPuzzle.map((row, i) => {
    return row.map((tile, j) => {
      let selected = false;
      if (i === rowIndex && j == colIndex) {
        selected = true;
      }
      const currentTile = {
        fill: tile.fill,
        selected: selected
      }
      return currentTile;
    });
  });
}

/**
 * Checks if the tile is in the same row / column as the tile dimensions stores in the firstSelected state from the Provider component
 * If so, sets the lastSelected state from the Provider component
 *
 * If not, deselects all tiles aside from the firstSelected tile
 *
 * @returns A new matrix of the puzzle, with the onMouseDown tile.selected = true
 */
export const setLastSelectedTile = (setLastSelected: React.Dispatch<React.SetStateAction<FirstLastSelectedState>>, currentPuzzle: TileState[][], firstSelected: FirstLastSelectedState, rowIndex: number, colIndex: number): TileState[][] => {
  if (rowIndex === firstSelected.rowIndex || colIndex === firstSelected.colIndex) {
    setLastSelected({ rowIndex: rowIndex, colIndex: colIndex });
    return currentPuzzle.map((row, i) => {
      return row.map((tile, j) => {
        let selected = false;
        if (i === firstSelected.rowIndex && j === firstSelected.colIndex) {
          selected = true;
        }
        if (i === rowIndex && j === colIndex) {
          selected = true;
        }
        const deselectedTile: TileState = {
          fill: tile.fill,
          selected: selected
        };
        return deselectedTile;
      });
    });
  }

  return currentPuzzle.map((row, i) => {
    return row.map((tile, j) => {
      let selected = false;
      if (i === firstSelected.rowIndex && j === firstSelected.colIndex) {
        selected = true;
      }
      const deselectedTile: TileState = {
        fill: tile.fill,
        selected: selected
      };
      return deselectedTile;
    });
  });
}

/**
 * Ensures that there are values in each of the row/column indexes of the first & last selected tiles
 * If not, returns an unchanged puzzle
 *
 * Checks if the line is being drawn row-wise ( x axis ) or column-wise ( y axis )
 * If both, then the only selected tile is the one stored in firstSelected ( lastSelected contains the same coordinates )
 * If only one of the two are true, a line is drawn
 *
 * To draw a line, the boundaries of the line are calculated ( between the firstSelected & lastSelected coordinates, inclusive )
 * currentPuzzle.map is then used to return a matrix with the firstSelected, lastSelected, & any tiles between them having selected = true
 *
 * If neither are true, an unchanged currentPuzzle is returned
 *
 * Draw direction is not taken into account for applying the selected value
 */
export const drawSelectedTileLine = (currentPuzzle: TileState[][], firstSelected: FirstLastSelectedState, lastSelected: FirstLastSelectedState): TileState[][] => {
  if (firstSelected.rowIndex === null || firstSelected.colIndex === null || lastSelected.rowIndex === null || lastSelected.colIndex === null) {
    return currentPuzzle;
  }

  const drawRow = firstSelected.rowIndex === lastSelected.rowIndex ? true : false;
  const drawCol = firstSelected.colIndex === lastSelected.colIndex ? true : false;

  if (drawRow && drawCol) {
    const updatedPuzzle = copyCurrentPuzzle(currentPuzzle);
    updatedPuzzle[firstSelected.rowIndex][firstSelected.colIndex].selected = true;
    return updatedPuzzle;
  }

  if (drawRow) {
    const startIndex = firstSelected.colIndex < lastSelected.colIndex ? firstSelected.colIndex : lastSelected.colIndex;
    const endIndex = firstSelected.colIndex > lastSelected.colIndex ? firstSelected.colIndex : lastSelected.colIndex;

    return currentPuzzle.map((row, i) => {
      return row.map((tile, j) => {
        let selected = false;
        if (i === firstSelected.rowIndex) {
          if (j >= startIndex && j <= endIndex) {
            selected = true;
          }
        }
        const selectedTile = {
          fill: tile.fill,
          selected: selected
        }
        return selectedTile;
      });
    });
  }

  if (drawCol) {
    const startIndex = firstSelected.rowIndex < lastSelected.rowIndex ? firstSelected.rowIndex : lastSelected.rowIndex;
    const endIndex = firstSelected.rowIndex > lastSelected.rowIndex ? firstSelected.rowIndex : lastSelected.rowIndex;

    return currentPuzzle.map((row, i) => {
      return row.map((tile, j) => {
        let selected = false;
        if (j === firstSelected.colIndex) {
          if (i >= startIndex && i <= endIndex) {
            selected = true;
          }
        }
        const selectedTile = {
          fill: tile.fill,
          selected: selected
        }
        return selectedTile;
      });
    });
  }
  return currentPuzzle;
}

/**
 * @returns Matrix with all the tiles' selected values set to false
 */
export const deselectTile = (currentPuzzle: TileState[][], setFirstSelected: React.Dispatch<React.SetStateAction<FirstLastSelectedState>>, setLastSelected: React.Dispatch<React.SetStateAction<FirstLastSelectedState>>): TileState[][] => {
  setFirstSelected({ rowIndex: null, colIndex: null });
  setLastSelected({ rowIndex: null, colIndex: null });

  return currentPuzzle.map((row, i) => {
    return row.map((tile, j) => {
      const deselectedTile: TileState = {
        fill: tile.fill,
        selected: false
      };
      return deselectedTile;
    });
  });
}

/**
 * Used to handle the fillTile of CreateNonogramProvider
 *
 * @returns Matrix where the selected FILL_STATE EMPTY tiles have been set to FILLED & the FILLED tiles have been set to EMPTY
 */
export const fillSelectedTile_CreateMode = (currentPuzzle: TileState[][], firstSelected: FirstLastSelectedState, lastSelected: FirstLastSelectedState): TileState[][] => {
  if (firstSelected.rowIndex === null || firstSelected.colIndex === null) {
    return currentPuzzle;
  }

  if (lastSelected.rowIndex === null || lastSelected.colIndex === null) {
    const updatedPuzzle = copyCurrentPuzzle(currentPuzzle);
    const tileFill = updatedPuzzle[firstSelected.rowIndex][firstSelected.colIndex].fill;
    updatedPuzzle[firstSelected.rowIndex][firstSelected.colIndex].fill = tileFill === FILL_STATE.EMPTY ? FILL_STATE.FILLED : FILL_STATE.EMPTY;
    return updatedPuzzle;
  }

  const drawRow = firstSelected.rowIndex === lastSelected.rowIndex ? true : false;
  const drawCol = firstSelected.colIndex === lastSelected.colIndex ? true : false;

  if (drawRow) {
    //const drawForwards = firstSelected.colIndex < lastSelected.colIndex ? true : false;
  }

  return currentPuzzle.map((row, i) => {
    return row.map((tile, j) => {
      let fill = tile.fill;
      if (tile.selected) {
        fill = fill === FILL_STATE.EMPTY ? FILL_STATE.FILLED : FILL_STATE.EMPTY;
      }
      const selectedTile = {
        fill: fill,
        selected: tile.selected
      }
      return selectedTile;
    });
  });
}

/**
 * Used to handle the markTile of PlayNonogramProvider
 *
 * @returns Matrix where the selected FILL_STATE EMPTY tiles have been set to MARKED & the MARKED tiles have been set to EMPTY
 */
export const markSelectedTile = (currentPuzzle: TileState[][], firstSelected: FirstLastSelectedState, lastSelected: FirstLastSelectedState): TileState[][] => {
  if (firstSelected.rowIndex === null || firstSelected.colIndex === null) {
    return currentPuzzle;
  }

  if (lastSelected.rowIndex === null || lastSelected.colIndex === null) {
    const rowIndex = firstSelected.rowIndex;
    const colIndex = firstSelected.colIndex;

    if (!checkTileMarkable(currentPuzzle[rowIndex][colIndex])) {
      return currentPuzzle;
    }

    const updatedPuzzle = copyCurrentPuzzle(currentPuzzle);
    const tileFill = updatedPuzzle[rowIndex][colIndex].fill;
    updatedPuzzle[rowIndex][colIndex].fill = tileFill === FILL_STATE.EMPTY ? FILL_STATE.MARKED : FILL_STATE.EMPTY;
    return updatedPuzzle;
  }

  const drawRow = firstSelected.rowIndex === lastSelected.rowIndex ? true : false;
  const drawCol = firstSelected.colIndex === lastSelected.colIndex ? true : false;

  if (drawRow) {
    //const drawForwards = firstSelected.colIndex < lastSelected.colIndex ? true : false;
  }

  return currentPuzzle.map((row, i) => {
    return row.map((tile, j) => {
      if (!checkTileMarkable(tile)) {
        return tile;
      }

      let fill = tile.fill;
      if (tile.selected) {
        fill = fill === FILL_STATE.EMPTY ? FILL_STATE.MARKED : FILL_STATE.EMPTY;
      }
      const selectedTile = {
        fill: fill,
        selected: tile.selected
      }
      return selectedTile;
    });
  });
}

interface FillTileResult_PlayMode {
  puzzle: TileState[][],
  tileFilled: boolean,
  tileErrored: boolean
}

/**
 * Determines the direction in which the player drew the select line
 * Runs corresponding fillTile_DrawForwards/Backwards depending on the direction the line was drawn
 */
export const fillSelectedTile_PlayMode = (puzzleSolution: boolean[][], currentPuzzle: TileState[][], firstSelected: FirstLastSelectedState, lastSelected: FirstLastSelectedState): FillTileResult_PlayMode => {
  const unchangedPuzzleData = {
    puzzle: currentPuzzle,
    tileFilled: false,
    tileErrored: false
  };

  if (firstSelected.rowIndex === null || firstSelected.colIndex === null) {
    return unchangedPuzzleData;
  }

  if ((firstSelected.rowIndex === lastSelected.rowIndex && firstSelected.colIndex === lastSelected.colIndex) || (lastSelected.rowIndex === null || lastSelected.colIndex === null)) {
    if (!checkTileFillable(currentPuzzle[firstSelected.rowIndex][firstSelected.colIndex])) {
      return unchangedPuzzleData;
    }
    const updatedPuzzleData = fillTile_DrawForwards(puzzleSolution, currentPuzzle);
    return updatedPuzzleData;
  }

  const updatedPuzzle: TileState[][] = [];
  let updatedPuzzleData: FillTileResult_PlayMode = {
    puzzle: updatedPuzzle,
    tileFilled: false,
    tileErrored: false
  };

  const drawRow = firstSelected.rowIndex === lastSelected.rowIndex ? true : false;
  const drawCol = firstSelected.colIndex === lastSelected.colIndex ? true : false;
  let drawForwards = true;
  if (drawRow) {
    drawForwards = firstSelected.colIndex < lastSelected.colIndex ? true : false;
  }
  if (drawCol) {
    drawForwards = firstSelected.rowIndex < lastSelected.rowIndex ? true : false;
  }


  if (drawForwards) {
    updatedPuzzleData = fillTile_DrawForwards(puzzleSolution, currentPuzzle);
  } else {
    updatedPuzzleData = fillTile_DrawBackwards(puzzleSolution, currentPuzzle);

  }

  return updatedPuzzleData;
}

const fillTile_DrawForwards = (puzzleSolution: boolean[][], currentPuzzle: TileState[][]): FillTileResult_PlayMode => {
  let tileFilled = false;
  let tileErrored = false;

  let updatedPuzzle = copyCurrentPuzzle(currentPuzzle);
  for (let i = 0; i < updatedPuzzle.length; i++) {
    for (let j = 0; j < updatedPuzzle[i].length; j++) {
      const tile = updatedPuzzle[i][j];
      if (!tile.selected || !checkTileFillable(tile)) {
        continue;
      }

      updatedPuzzle[i][j].fill = puzzleSolution[i][j] ? FILL_STATE.FILLED : FILL_STATE.ERROR;

      if (puzzleSolution[i][j]) {
        tileFilled = true;
      } else {
        tileErrored = true;
        break;
      }
    }
    if (tileErrored) {
      break;
    }
  }

  if (tileFilled) {
    updatedPuzzle = markCompleteLines(puzzleSolution, updatedPuzzle);
  }

  return {
    puzzle: updatedPuzzle,
    tileFilled: tileFilled,
    tileErrored: tileErrored
  };
}

const fillTile_DrawBackwards = (puzzleSolution: boolean[][], currentPuzzle: TileState[][]): FillTileResult_PlayMode => {
  let tileFilled = false;
  let tileErrored = false;

  let updatedPuzzle = copyCurrentPuzzle(currentPuzzle);
  for (let i = updatedPuzzle.length - 1; i >= 0; i--) {
    for (let j = updatedPuzzle[i].length - 1; j >= 0; j--) {
      const tile = updatedPuzzle[i][j];
      if (!tile.selected || !checkTileFillable(tile)) {
        continue;
      }

      updatedPuzzle[i][j].fill = puzzleSolution[i][j] ? FILL_STATE.FILLED : FILL_STATE.ERROR;

      if (puzzleSolution[i][j]) {
        tileFilled = true;
      } else {
        tileErrored = true;
        break;
      }
    }
    if (tileErrored) {
      break;
    }
  }

  if (tileFilled) {
    updatedPuzzle = markCompleteLines(puzzleSolution, updatedPuzzle);
  }

  return {
    puzzle: updatedPuzzle,
    tileFilled: tileFilled,
    tileErrored: tileErrored
  };
}

// 5|1111100000100001100011011

const markCompleteLines = (puzzleSolution: boolean[][], currentPuzzle: TileState[][]): TileState[][] => {
  let rowLineComplete = false;
  let colLineComplete = false;
  let updatedPuzzle = copyCurrentPuzzle(currentPuzzle);

  for (let i = 0; i < currentPuzzle.length; i++) {
    if (checkLineComplete(puzzleSolution[i], currentPuzzle[i])) {
      rowLineComplete = true;
      updatedPuzzle = markRowComplete(updatedPuzzle, i);
    }
  }

  for (let i = 0; i < getPuzzleByColumn(currentPuzzle).length; i++) {
    if (checkLineComplete(getColumn(puzzleSolution, i), getColumn(currentPuzzle, i))) {
      colLineComplete = true;
      updatedPuzzle = markColComplete(updatedPuzzle, i);
    }
  }
  return updatedPuzzle;
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
const markRowComplete = (updatedPuzzle: TileState[][], rowIndex: number): TileState[][] => {
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
const markColComplete = (updatedPuzzle: TileState[][], colIndex: number): TileState[][] => {
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