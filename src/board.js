/* ---- Imports Section */
import React, { useEffect, useState } from 'react';
/* End ---- */

// Tiles are only aware of their fillState & coords.
// When they're clicked, they tell the picross provider their coords. & the game array is updated
const Tile = ({ fill, row, col, fillTile, markTile }) => {
  return (
    <div className={`tile ${fill}`} onClick={e => fillTile(e, row, col)} onContextMenu={e => markTile(e, row, col)}></div>
  );
}

/* ---- Hint Text Display */
const ColHints = ({ hints, boardHeight }) => {
  // Loop matrix of column hints to display them above the board
  let colHints = hints.colHints;
  return (
    <div className='colHintContainer' key='colHintContainer'>
      {colHints.map((col, i) =>
        <div className='colHints' key={`colHintCollection${i}`} >
          {col && col.length
            ? col[0] === boardHeight
              ? [...col].map((row, j) => <div key={`colHint${i} - ${j}`} className='fullHint'>{colHints[i][j]}</div>)
              : [...col].map((row, j) => <div key={`colHint${i} - ${j}`}>{colHints[i][j]}</div>)
            : <div key={`colHint${i} - ${0}`} className='zeroHint'>0</div>
          }
        </div>
      )}
    </div>
  );
}

const RowHints = ({ hints, boardWidth }) => {
  // Loop matrix of column hints to display them beside the board
  let rowHints = hints.rowHints;
  return (
    <div className='rowHintContainer' key='rowHintContainer'>
      {rowHints.map((row, i) =>
        <div className='rowHints' key={`rowHintCollection${i}`} >
          {row && row.length
            ? row[0] === boardWidth
              ? [...row].map((col, j) => <div key={`rowHint${i} - ${j}`} className='fullHint'>{rowHints[i][j]}</div>)
              : [...row].map((col, j) => <div key={`rowHint${i} - ${j}`}>{rowHints[i][j]}</div>)
            : <div key={`rowHint${i} - ${0}`} className='zeroHint'>0</div>
          }
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
  const fillState = {
    empty: '',
    filled: 'filled',
    error: 'error',
    marked: 'marked'
  };
  const [currentGame, setCurrentGame] = useState(CreateCurrentGameay(gameSolution, fillState));
  let hints = CreateHints(gameSolution);

  useEffect(() => {
    // Reset currentGame when useEffect triggered ( don't keep prev. zero hint error lines )
    let updatedGame = CreateCurrentGameay(gameSolution, fillState);

    // Find zero hint lines ( rows and/or columns ) & pass to functions to set fillState.error
    for (let i = 0; i < hints.colHints.length; i++) {
      if (hints.colHints[i].length === 0) {
        setTileColZero(i, updatedGame);
      }
    }
    for (let i = 0; i < hints.rowHints.length; i++) {
      if (hints.rowHints[i].length === 0) {
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
    let updatedGame = CopycurrentGameay(currentGame);
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
    let updatedGame = CopycurrentGameay(currentGame);
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

/* ---- Create / Copy Functions */
const CreateHints = (gameSolution) => {
  let colHints = [];
  let rowHints = [];

  for (let i = 0; i < gameSolution.length; i++) {
    let innerCHints = [];
    let innerRHints = [];
    let colHint = 0;
    let rowHint = 0;

    for (let j = 0; j < gameSolution[i].length; j++) {
      let colSolution = gameSolution[j][i];
      let rowSolution = gameSolution[i][j];

      // Count col-adjacent trues, add current amount when false or when row end
      if (colSolution) {
        colHint++;
      } else if (!colSolution && colHint !== 0) {
        innerCHints.push(colHint);
        colHint = 0;
      }
      // Count row-adjacent trues, add current amount when false or when row end
      if (rowSolution) {
        rowHint++;
      } else if (!rowSolution && rowHint !== 0) {
        innerRHints.push(rowHint);
        rowHint = 0;
      }
    }
    if (colHint !== 0) {
      innerCHints.push(colHint);
    }
    if (rowHint !== 0) {
      innerRHints.push(rowHint);
    }

    colHints.push(innerCHints);
    rowHints.push(innerRHints);
  }
  //console.log(colHints);
  //console.log(rowHints);

  // Return an object containing two 2D arrays allows for a single function to handle the creation of both column & row hintd
  return {
    colHints: colHints,
    rowHints: rowHints
  };
}

const CreateCurrentGameay = (gameSolution, fillState) => {
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
const CopycurrentGameay = (currentGame) => {
  let gameCopy = [];
  for (let i = 0; i < currentGame.length; i++) {
    gameCopy[i] = [];
    for (let j = 0; j < currentGame[i].length; j++) {
      gameCopy[i][j] = currentGame[i][j];
    }
  }
  return gameCopy;
}