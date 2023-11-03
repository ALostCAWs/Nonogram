/* ---- Imports Section */
import React, { useState, useEffect, createContext } from 'react';
import { fillState } from '../state.js';
// Components
import { Board } from '../boardDisplay/board.js';
import { GameComplete } from './endScreens/gameComplete.js';
import { GameOver } from './endScreens/gameOver.js';
// Functions
import { createLives, createCurrentGame, copyCurrentGame, checkZeroLines } from './gameSetup.js';
import { checkLineComplete, checkGameComplete, getColumn } from '../boardDisplay/getBoardInfo.js';
/* End ---- */

// TODO:
// update look of the site; color scheme, life imgs, tile 'x' img

// incorporate backend for saving game progress, track completed puzzles

// play game & create game mode
// browse puzzles, store if user completed them

// Knows the gameSolution ( can be passed to board, maybe not needed though )
// Secondary currentGame, same size as gameSolution, manages the users' progress
// Sets the FillModeContext, which is used to dictate which function the Tile components use as their onClick callback functions
// Tiles use callbacks to functions within when onClick
// When tile filled, NonogramProvider checks for column / row completion
// currentGame passed to Board, making Board purely for displaying

export const FillModeContext = createContext(null);
export const NonogramProvider = ({ gameSolution }) => {
  const [fillMode, setFillMode] = useState();
  const [currentGame, setCurrentGame] = useState(createCurrentGame(gameSolution));
  const [lives, setLives] = useState(createLives(gameSolution));
  const [gameComplete, setGameComplete] = useState(checkGameComplete(gameSolution, currentGame));

  /* useEffect ---- Game Setup / Change / Complete */
  useEffect(() => {
    setFillMode(true);
  }, []);

  // useEffect triggers on gameComplete change to call set any zero lines to fillState.error
  // Ensures zero lines are filled correctly when puzzle reset
  useEffect(() => {
    setCurrentGame(game => checkZeroLines(game, gameSolution));
  }, [gameComplete]);

  // useEffect triggers on gameSolution change to call resetGame
  useEffect(() => {
    resetGame();
  }, [gameSolution]);

  /* Functions ---- */
  /* ---- Game Setup / Change / Complete */
  const resetGame = () => {
    // Using resetGame in place of currentGame to avoid initialization issues
    // Pre-resetGame currentGame was being used still after creating a fresh currentGame, preventing gameComplete value from updating on retry game start
    let resetGame = checkZeroLines(createCurrentGame(gameSolution), gameSolution);
    setCurrentGame(resetGame);
    setLives(createLives(gameSolution));
    setGameComplete(checkGameComplete(gameSolution, resetGame));
  }

  /* ---- Toggle Fill Mode */
  const toggleFillMode = () => {
    if (lives === 0) {
      return;
    }
    setFillMode(currentMode => !currentMode);
  }

  /* ---- Tile Interaction */
  // R-click to attempt fill, fillState.filled & fillState.error are not removable
  const fillTile = (e, rowIndex, colIndex) => {
    if (lives === 0) {
      return;
    }
    if (currentGame[rowIndex][colIndex] !== fillState.empty) {
      return;
    }
    if (gameSolution[rowIndex][colIndex]) {
      const clickedRow = document.querySelector(`.rowHint${rowIndex}`);
      const clickedCol = document.querySelector(`.colHint${colIndex}`);
      let updatedGame = copyCurrentGame(currentGame);
      updatedGame[rowIndex][colIndex] = fillState.filled;

      // Check if filling the tile completed the column and / or row it's in
      const colLineComplete = checkLineComplete(getColumn(gameSolution, colIndex), getColumn(updatedGame, colIndex), colIndex);
      const rowLineComplete = checkLineComplete(gameSolution[rowIndex], updatedGame[rowIndex], rowIndex);

      // If line is complete, set all empty or marked tiles to complete
      if (colLineComplete) {
        console.log('col complete');
        clickedCol.classList.add('completeLineHint');
        updatedGame = setColComplete(updatedGame, colIndex);
      }
      if (rowLineComplete) {
        console.log('row complete');
        clickedRow.classList.add('completeLineHint');
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
    if (lives === 0) {
      return;
    }
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
    if (lives === 0) {
      return;
    }
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
  // This keeps in line with existing nonogram games; avoids holding users' hand too much
  // In this game, fillState.complete is set up to specifically disallow removal unlike many other nonogram games as that feels unfair for a user to be able to accidentally undo their own progress ( in a sense ) & trigger errors on lines they have already solved
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

      <FillModeContext.Provider value={fillMode}>
        <Board currentGame={currentGame} gameSolution={gameSolution} lives={lives} fillTile={fillTile} markTile={markTile} hoverTile={hoverTile} />
      </FillModeContext.Provider>

      {gameComplete && (
        <GameComplete lives={lives} resetGame={resetGame} />
      )}
      <button type='button' className='fillModeButton toggleFillMode button' onClick={() => toggleFillMode()} disabled={fillMode}>Fill</button>
      <button type='button' className='markModeButton toggleFillMode button' onClick={() => toggleFillMode()} disabled={!fillMode}>Mark</button>
    </>
  );
}