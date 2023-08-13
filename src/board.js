/* ---- Imports Section */
import React, { useEffect, useState } from 'react';
/* End ---- */
const fillState = {
  empty: '',
  filled: 'filled',
  error: 'error',
  marked: 'marked'
};
const hintState = {
  incomplete: '',
  fullLineIncomplete: 'fullLineIncomplete',
  zero: 'zeroHint',
  complete: 'completeHint'
};

// Tiles are only aware of their fillState & coords.
// When they're clicked, they tell the picross provider their coords. & the game array is updated
const Tile = ({ fill, row, col, fillTile, markTile }) => {
  return (
    <div className={`tile ${fill}`} onClick={e => fillTile(e, row, col)} onContextMenu={e => markTile(e, row, col)}></div>
  );
}

/* ---- Hint Text Display */
// Check if . . .
// Individual hint = gameHeight (col) gameWidth (row) & set to fullHint
// Hint array for a given col / row empty & set to zeroHint
const Hints = ({ lineGameSolution, currentLineGame, index }) => {
  let hints = [];
  let hintCount = 0;
  let currentTilesInHintGameState = [];

  for (let j = 0; j < lineGameSolution.length; j++) {
    let solution = lineGameSolution[j];

    // Count col-adjacent trues, add current amount when false or when row end
    if (solution) {
      hintCount++;
      currentTilesInHintGameState.push(currentLineGame[j]);
    }

    // If at end of column/row or an unfillable tile is found & there is a hint counted, populate hint object
    if ((j === lineGameSolution.length - 1 || !solution) && hintCount !== 0) {
      // Default hintState setup for fullLineIncomplete & incomplete
      let state = hintCount === lineGameSolution.length ? hintState.fullLineIncomplete : hintState.incomplete;

      // Check if currentTilesInHintGameState ( now a Set => currentTilesInHintGameStateReduced ) contains one fillState.filled item
      let currentTilesInHintGameStateReduced = new Set(currentTilesInHintGameState);
      if (currentTilesInHintGameStateReduced.size === 1 && currentTilesInHintGameStateReduced.has(fillState.filled)) {
        state = hintState.complete;
      }

      // Push hint & reset to continue checking for potential hints
      let hint = {
        value: hintCount,
        state: state
      }
      hints.push(hint);
      hintCount = 0;
      currentTilesInHintGameState = [];
    }
  }
  // If hints for a line is empty, that entire line is empty
  if (hints.length === 0) {
    // Set hint zero value & state
    let hint = {
      value: 0,
      state: hintState.zero
    }
    hints.push(hint);
  }
  return (
    <>
      {hints.map((hint, i) => <div key={`hint${index} - ${i}`} className={`${hint.state}`}>{hint.value}</div>)}
    </>
  );
}

const GetColumn = (inputGame, colIndex) => {
  let column = [];
  for (let i = 0; i < inputGame.length; i++) {
    column.push(inputGame[i][colIndex]);
  }
  return column;
}


const Board = ({ currentGame, gameSolution, fillTile, markTile }) => {
  // Decouple tiles from board by mapping within return rather than for looping in useEffect
  return (
    <div className='boardContainer'>
      <div className='colHintContainer' key='colHintContainer'>
        {gameSolution.map((row, i) =>
          <div key={`colHintCollection${i}`} className='colHints'>
            <Hints lineGameSolution={GetColumn(gameSolution, i)} currentLineGame={GetColumn(currentGame, i)} index={i} />
          </div>
        )}
      </div>

      <div className='rowHintContainer' key='rowHintContainer'>
        {gameSolution.map((row, i) =>
          <div key={`rowHintCollection${i}`} className='rowHints'>
            <Hints lineGameSolution={row} currentLineGame={currentGame[i]} index={i} />
          </div>
        )}
      </div>

      <div className='board'>
        {currentGame.map((row, i) =>
          row.map((col, j) =>
            <Tile key={`${i} - ${j}`} fill={currentGame[i][j]} row={i} col={j} fillTile={fillTile} markTile={markTile} />
          )
        )}
      </div>
    </div>
  );
}

// TODO:
// grey hint if hint complete; when tile onclick -> filled, check for hint completion
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