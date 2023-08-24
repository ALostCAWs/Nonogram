/* ---- Imports Section */
import React, { useEffect, useState } from 'react';
import { fillState, hintState } from '../state';
// Components
import { Board } from '../boardDisplay/board';
import { GameComplete } from './endScreens/gameComplete';
import { GameOver } from './endScreens/gameOver';
// Functions
import { createLives, createCurrentGame, copyCurrentGame, checkZeroLines } from '../gameSetup';
import { checkLineComplete, checkGameComplete, getColumn } from './getBoardInfo';
/* End ---- */

// TODO:
// update look of the site; color scheme, life imgs, tile 'x' img

// add ability to toggle between tile fillMode & markupMode ( rather than R-click / L-click )

// incorporate backend for saving games created with create mode
// incorporate backend for saving game progress, track completed puzzles

// add other board sizes
// update grid col / row count & tile sizes in react ?  or need classes for size differences ?

// play game & create game mode
// create allows user to fill in an empty picross board & save it as a puzzle to be played
// requires a back end or hash of some kind to load the created game solution as a puzzle

// Knows the gameSolution ( can be passed to board, maybe not needed though )
// Secondary currentGame, same size as gameSolution, manages the users' progress
// Tiles use callbacks to functions within when onClick / onContextMenu
// When tile filled, PicrossProvider checks for column / row completion
// currentGame passed to Board, making Board purely for displaying
export const PicrossProvider = ({ gameSolution }) => {
  const [currentGame, setCurrentGame] = useState(createCurrentGame(gameSolution));
  const [lives, setLives] = useState(createLives(gameSolution));
  const [gameComplete, setGameComplete] = useState(checkGameComplete(gameSolution, currentGame));

  // useEffect triggers on gameComplete change to call set any zero lines to fillState.error
  // Ensures zero lines are filled correctly when puzzle reset
  useEffect(() => {
    setCurrentGame(game => checkZeroLines(game, gameSolution));
  }, [gameComplete]);

  // useEffect triggers on gameSolution change to call resetGame
  useEffect(() => {
    resetGame();
  }, [gameSolution]);

  // Reset currentGame, lives, & gameComplete
  const resetGame = () => {
    // Using resetGame in place of currentGame to avoid initialization issues
    // Pre-resetGame currentGame was being used still after creating a fresh currentGame, preventing gameComplete value from updating on retry game start
    let resetGame = checkZeroLines(createCurrentGame(gameSolution), gameSolution);
    setCurrentGame(resetGame);
    setLives(createLives(gameSolution));
    setGameComplete(checkGameComplete(gameSolution, resetGame));
  }

  /* ---- Tile Interaction Functions */
  // R-click to attempt fill, fillState.filled & fillState.error are not removable
  const fillTile = (e, rowIndex, colIndex) => {
    if (currentGame[rowIndex][colIndex] !== fillState.empty) {
      return;
    }
    if (gameSolution[rowIndex][colIndex]) {
      let updatedGame = copyCurrentGame(currentGame);
      updatedGame[rowIndex][colIndex] = fillState.filled;

      // Check if filling the tile completed the column and / or row it's in
      const colLineComplete = checkLineComplete(getColumn(gameSolution, colIndex), getColumn(updatedGame, colIndex), colIndex);
      const rowLineComplete = checkLineComplete(gameSolution[rowIndex], updatedGame[rowIndex], rowIndex);

      // If line is complete, set all empty or marked tiles to complete
      if (colLineComplete) {
        updatedGame = setColComplete(updatedGame, colIndex);
      }
      if (rowLineComplete) {
        updatedGame = setRowComplete(updatedGame, rowIndex);
      }
      // Only need to check for game completion if both a column & row were completed by this tile being filled
      if (colLineComplete && rowLineComplete) {
        setGameComplete(checkGameComplete(gameSolution, updatedGame));
      }
      setCurrentGame(updatedGame);
    } else {
      // Upon error, reduce lives
      setCurrentGame(game => {
        return game.map((row, i) => {
          return row.map((fill, j) => {
            if (rowIndex === i && colIndex === j) {
              return fillState.error;
            } else {
              return fill;
            }
          });
        });
      });
      setLives(currentLives => currentLives - 1);
    }
  }
  // L-click to mark ( used as a removable penalty-free reference )
  const markTile = (e, rowIndex, colIndex) => {
    e.preventDefault();
    setCurrentGame(game => {
      return game.map((row, i) => {
        return row.map((fill, j) => {
          if (rowIndex === i && colIndex === j) {
            return fill === fillState.empty ? fillState.marked : fillState.empty;
          } else {
            return fill;
          }
        });
      });
    });
  }
  // Hovering over a tile highlights it & its' corresponding column / row hints
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
  // If line complete, set remaining tiles in column / row to complete
  // This is only set for lines in which every fillable tile has been filled, specifically NOT for lines with 0 fillable tiles or incomplete lines
  // Lines with 0 fillable tiles are all marked error on game initialization
  // Lines with some completed hints do not trigger this, even in obvious cases such as first / last hint completion
  // This keeps in line with existing picross games; avoids holding users' hand too much
  // In this game, fillState.complete is set up to specifically disallow removal unlike many other picross games as that feels unfair for a user to be able to accidentally undo their own progress ( in a sense ) & trigger errors on lines they have already solved
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

  return (
    <>
      {lives === 0 && (
        <GameOver resetGame={resetGame} />
      )}

      <Board currentGame={currentGame} gameSolution={gameSolution} lives={lives} fillTile={fillTile} markTile={markTile} hoverTile={hoverTile} />

      {gameComplete && (
        <GameComplete lives={lives} resetGame={resetGame} />
      )}
    </>
  );
}