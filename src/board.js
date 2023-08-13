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
  full: 'fullHint',
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
const ColHints = ({ hints }) => {
  // Loop matrix of column hints to display them above the board
  let colHints = hints.colHints;
  return (
    <div className='colHintContainer' key='colHintContainer'>
      {colHints.map((col, i) =>
        <div className='colHints' key={`colHintCollection${i}`} >
          {[...col].map((hint, j) => <div key={`colHint${i} - ${j}`} className={`${hint.state}`}>{hint.value}</div>)}
        </div>
      )
      }
    </div>
  );
}

const RowHints = ({ hints }) => {
  // Loop matrix of column hints to display them beside the board
  let rowHints = hints.rowHints;
  return (
    <div className='rowHintContainer' key='rowHintContainer'>
      {rowHints.map((row, i) =>
        <div className='rowHints' key={`rowHintCollection${i}`} >
          {[...row].map((hint, j) => <div key={`rowHint${i} - ${j}`} className={`${hint.state}`}>{hint.value}</div>)}
        </div>
      )}
    </div>
  );
}

const Board = ({ currentGame, hints, fillTile, markTile }) => {
  // Decouple tiles from board by mapping within return rather than for looping in useEffect
  return (
    <div className='boardContainer'>
      <ColHints hints={hints} boardHeight={currentGame.length} />
      <RowHints hints={hints} boardWidth={currentGame[0].length} />

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
  let hints = CreateHints(gameSolution, currentGame);

  useEffect(() => {
    // Reset currentGame when useEffect triggered ( don't keep prev. zero hint error lines )
    let updatedGame = CreateCurrentGame(gameSolution);

    // Find zero hint lines ( rows and/or columns ) & pass to functions to set fillState.error
    for (let i = 0; i < hints.colHints.length; i++) {
      if (hints.colHints[i][0].value === 0) {
        setTileColZero(i, updatedGame);
      }
    }
    for (let i = 0; i < hints.rowHints.length; i++) {
      if (hints.rowHints[i][0].value === 0) {
        setTileRowZero(i, updatedGame);
      }
    }
    // Call setCurrentGame once to avoid issues
    setCurrentGame(updatedGame);
  }, [gameSolution]);

  /* ---- Initial Game Setup Functions */
  // Functions to set all tiles in zero hint lines ( rows and/or columns ) to fillState.error
  const setTileColZero = (col, currentGame) => {
    for (let i = 0; i < currentGame.length; i++) {
      currentGame[i][col] = fillState.error;
    }
  }
  const setTileRowZero = (row, currentGame) => {
    for (let i = 0; i < currentGame.length; i++) {
      currentGame[row][i] = fillState.error;
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
      <Board currentGame={currentGame} hints={hints} fillTile={fillTile} markTile={markTile} />
    </>
  );
}

/* ---- Hint Functions */
// TODO:
// Grey hints when all tiles associated with that hint are filled
// Hints become an obj with a value & a hintState ( determines color of hint )

// Check if . . .
// Individual hint = gameHeight (col) gameWidth (row) & set to fullHint
// Hint array for a given col / row empty & set to zeroHint
const CreateHints = (gameSolution, currentGame) => {
  let colHints = [];
  let rowHints = [];
  let boardHeight = currentGame.length;
  let boardWidth = currentGame[0].length;

  for (let i = 0; i < gameSolution.length; i++) {
    let innerCHints = [];
    let innerRHints = [];
    let colHintCount = 0;
    let rowHintCount = 0;

    for (let j = 0; j < gameSolution[i].length; j++) {
      let colSolution = gameSolution[j][i];
      let rowSolution = gameSolution[i][j];
      let currentColHintInGame = [];
      let currentRowHintInGame = [];

      // Count col-adjacent trues, add current amount when false or when row end
      if (colSolution) {
        colHintCount++;
        console.log('column hint');
        console.log(i);
        currentColHintInGame.push(currentGame[j][i]);
      }
      // If at end of column or an unfillable tile is found & there is a hint counted, populate hint object
      if ((j === boardHeight - 1 || !colSolution) && colHintCount !== 0) {
        let colHint = CreateHint(colHintCount, boardHeight, currentColHintInGame);
        innerCHints.push(colHint);
        colHintCount = 0;
        currentColHintInGame = [];
      }

      // Count row-adjacent trues, add current amount when false or when row end
      if (rowSolution) {
        rowHintCount++;
        console.log('row hint');
        console.log(j);
        currentRowHintInGame.push(currentGame[i][j]);
      }
      // If at end of row or an unfillable tile is found & there is a hint counted, populate hint object
      if ((j === boardWidth - 1 || !rowSolution) && rowHintCount !== 0) {
        let rowHint = CreateHint(rowHintCount, boardWidth, currentRowHintInGame);
        innerRHints.push(rowHint);
        rowHintCount = 0;
        currentRowHintInGame = [];
      }
    }
    // Add 0 to innerColHints if last in col is 0 & innerCHints is empty
    if (innerCHints.length === 0) {
      let colHint = {
        value: 0,
        state: hintState.zero
      }
      innerCHints.push(colHint);
    }
    // Add 0 to innerRowHints if last in row is 0 & innerRHints is empty
    if (innerRHints.length === 0) {
      let rowHint = {
        value: 0,
        state: hintState.zero
      }
      innerRHints.push(rowHint);
    }
    colHints.push(innerCHints);
    rowHints.push(innerRHints);
  }
  console.log(colHints);
  console.log(rowHints);

  // Return object containing two 2-D arrays of objects
  return {
    colHints: colHints,
    rowHints: rowHints
  };
}

const CreateHint = (hintCount, maxHint, currentHintInGame) => {
  console.log(currentHintInGame);
  let currentHintInGameReduced = new Set(currentHintInGame);
  console.log(currentHintInGameReduced);
  let state = hintCount === maxHint ? hintState.full : hintState.incomplete;
  // Check if currentHintInGame ( now a Set ) contains one fillState.filled item
  if (currentHintInGame.length === 1 && currentHintInGame[0] === fillState.filled) {
    state = hintState.complete;
  }
  let hint = {
    value: hintCount,
    state: state
  }
  return hint;
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