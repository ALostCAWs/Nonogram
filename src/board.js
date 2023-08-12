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
const ColHints = ({ hintObj, boardHeight }) => {
  // Loop matrix of column hints to display them above the board
  let colHintArr = hintObj.colHintArr;
  return (
    <div className='colHintContainer' key='colHintContainer'>
      {colHintArr.map((col, i) =>
        <div className='colHints' key={`colHintCollection${i}`} >
          {col && col.length
            ? col[0] === boardHeight
              ? [...col].map((row, j) => <div key={`colHint${i} - ${j}`} className='fullHint'>{colHintArr[i][j]}</div>)
              : [...col].map((row, j) => <div key={`colHint${i} - ${j}`}>{colHintArr[i][j]}</div>)
            : <div key={`colHint${i} - ${0}`} className='zeroHint'>0</div>
          }
        </div>
      )}
    </div>
  );
}

const RowHints = ({ hintObj, boardWidth }) => {
  // Loop matrix of column hints to display them beside the board
  let rowHintArr = hintObj.rowHintArr;
  return (
    <div className='rowHintContainer' key='rowHintContainer'>
      {rowHintArr.map((row, i) =>
        <div className='rowHints' key={`rowHintCollection${i}`} >
          {row && row.length
            ? row[0] === boardWidth
              ? [...row].map((col, j) => <div key={`rowHint${i} - ${j}`} className='fullHint'>{rowHintArr[i][j]}</div>)
              : [...row].map((col, j) => <div key={`rowHint${i} - ${j}`}>{rowHintArr[i][j]}</div>)
            : <div key={`rowHint${i} - ${0}`} className='zeroHint'>0</div>
          }
        </div>
      )}
    </div>
  );
}

const Board = ({ gameArr, hintObj, fillTile, markTile }) => {
  // Decouple tiles from board by mapping within return rather than for looping in useEffect
  return (
    <div className='boardContainer'>
      <ColHints hintObj={hintObj} boardHeight={gameArr.length} />
      <RowHints hintObj={hintObj} boardWidth={gameArr[0].length} />

      <div className='board'>
        {gameArr.map((row, i) =>
          row.map((col, j) =>
            <Tile key={`${i} - ${j}`} fill={gameArr[i][j]} row={i} col={j} fillTile={fillTile} markTile={markTile} />
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
// Knows the solutionArr ( can be passed to board, maybe not needed though )
// Secondary gameArr, same size as solutionArr, manages the users' progress
// Tiles use callbacks to functions within when onClick / onContextMenu
// gameArr passed to Board, making Board purely for displaying
export const PicrossProvider = ({ solutionArr }) => {
  const fillState = {
    empty: '',
    filled: 'filled',
    error: 'error',
    marked: 'marked'
  };
  const [gameArr, setGameArr] = useState(CreateGameArray(solutionArr, fillState));
  let hintObj = CreateHintObj(solutionArr);

  useEffect(() => {
    // Reset gameArr when useEffect triggered ( don't keep prev. zero hint error lines )
    let updatedGameArr = CreateGameArray(solutionArr, fillState);

    // Find zero hint lines ( rows and/or columns ) & pass to functions to set fillState.error
    for (let i = 0; i < hintObj.colHintArr.length; i++) {
      if (hintObj.colHintArr[i].length === 0) {
        setTileColZero(i, updatedGameArr);
      }
    }
    for (let i = 0; i < hintObj.rowHintArr.length; i++) {
      if (hintObj.rowHintArr[i].length === 0) {
        setTileRowZero(i, updatedGameArr);
      }
    }
    // Call setGameArr once to avoid issues
    setGameArr(updatedGameArr);
  }, [solutionArr]);

  /* ---- Initial Game Setup Functions */
  // Functions to set all tiles in zero hint lines ( rows and/or columns ) to fillState.error
  const setTileColZero = (col, gameArr) => {
    for (let i = 0; i < gameArr.length; i++) {
      gameArr[i][col] = fillState.error;
    }
  }
  const setTileRowZero = (row, gameArr) => {
    for (let i = 0; i < gameArr.length; i++) {
      gameArr[row][i] = fillState.error;
    }
  }

  /* ---- Tile Interaction Functions */
  // R-click to attempt fill
  const fillTile = (e, row, col) => {
    let updatedGameArr = CopyGameArray(gameArr);
    if (gameArr[row][col] !== fillState.empty) {
      return;
    }
    if (solutionArr[row][col]) {
      updatedGameArr[row][col] = fillState.filled;
    } else {
      updatedGameArr[row][col] = fillState.error;
    }
    setGameArr(updatedGameArr);
  }
  // L-click to mark ( used as penalty-free reference )
  const markTile = (e, row, col) => {
    e.preventDefault();
    let updatedGameArr = CopyGameArray(gameArr);
    if (gameArr[row][col] === fillState.empty) {
      updatedGameArr[row][col] = fillState.marked;
    } else if (gameArr[row][col] === fillState.marked) {
      updatedGameArr[row][col] = fillState.empty;
    }
    setGameArr(updatedGameArr);
  }
  console.log(gameArr);
  return (
    <>
      <Board gameArr={gameArr} hintObj={hintObj} fillTile={fillTile} markTile={markTile} />
    </>
  );
}

/* ---- Create / Copy Functions */
const CreateHintObj = (solutionArr) => {
  let rowHintArr = [];
  let colHintArr = [];

  for (let i = 0; i < solutionArr.length; i++) {
    let innerRHintArr = [];
    let innerCHintArr = [];
    let rowHint = 0;
    let colHint = 0;

    for (let j = 0; j < solutionArr[i].length; j++) {
      let rowSolution = solutionArr[i][j];
      let colSolution = solutionArr[j][i];

      // Count row-adjacent trues, add current amount when false or when row end
      if (rowSolution) {
        rowHint++;
      } else if (!rowSolution && rowHint !== 0) {
        innerRHintArr.push(rowHint);
        rowHint = 0;
      }
      // Count col-adjacent trues, add current amount when false or when row end
      if (colSolution) {
        colHint++;
      } else if (!colSolution && colHint !== 0) {
        innerCHintArr.push(colHint);
        colHint = 0;
      }
    }
    if (rowHint !== 0) {
      innerRHintArr.push(rowHint);
    }
    if (colHint !== 0) {
      innerCHintArr.push(colHint);
    }

    rowHintArr.push(innerRHintArr);
    colHintArr.push(innerCHintArr);
  }
  //console.log(colHintArr);
  //console.log(rowHintArr);

  return {
    rowHintArr: rowHintArr,
    colHintArr: colHintArr
  };
}

const CreateGameArray = (solutionArr, fillState) => {
  let gameArr = [];
  for (let i = 0; i < solutionArr.length; i++) {
    gameArr[i] = [];
    for (let j = 0; j < solutionArr[i].length; j++) {
      gameArr[i][j] = fillState.empty;
    }
  }

  return gameArr;
}

// A simple assignment failed to trigger a re-render due to the arrays referencing the same point in memory
const CopyGameArray = (gameArr) => {
  let copyArr = [];
  for (let i = 0; i < gameArr.length; i++) {
    copyArr[i] = [];
    for (let j = 0; j < gameArr[i].length; j++) {
      copyArr[i][j] = gameArr[i][j];
    }
  }
  return copyArr;
}