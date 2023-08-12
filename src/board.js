/* ---- Imports Section */
import React, { useEffect, useState } from 'react';
/* End ---- */

// tiles should only know what their fillSate is & their coords.
// when they're clicked, they tell the picross provider their coords. & the game array is updated
const Tile = ({ fill, row, col, fillTile, markTile }) => {
  return (
    <div className={`tile ${fill}`} onClick={e => fillTile(e, row, col)} onContextMenu={e => markTile(e, row, col)}></div>
  );
}

// todo:
// if colhints / rowhints to display 0, take row index i & colour as error
// if colhint / rowhint to display hint equal to whole line add class, bold hint text / colour vibrantly

const ColHints = ({ hintObj }) => {
  // Loop matrix of column hints to display them above the board
  let colHintArr = hintObj.colHintArr;
  return (
    <div className='colHintContainer' key='colHintContainer'>
      {colHintArr.map((col, i) =>
        <div className='colHints' key={`colHintCollection${i}`} >
          {col && col.length
            ? [...col].map((row, j) => <div key={`colHint${i} - ${j}`}>{colHintArr[i][j]}</div>)
            : <div key={`colHint${i} - ${0}`} className='zeroHint'>0</div>
          }
        </div>
      )}
    </div>
  );
}

const RowHints = ({ hintObj }) => {
  // Loop matrix of column hints to display them beside the board
  let rowHintArr = hintObj.rowHintArr;
  return (
    <div className='rowHintContainer' key='rowHintContainer'>
      {rowHintArr.map((row, i) =>
        <div className='rowHints' key={`rowHintCollection${i}`} >
          {row && row.length
            ? [...row].map((col, j) => <div key={`rowHint${i} - ${j}`}>{rowHintArr[i][j]}</div>)
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
      <ColHints hintObj={hintObj} gameArr={gameArr} />
      <RowHints hintObj={hintObj} gameArr={gameArr} />

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

//todo:
// grey hint if hint complete; when tile onclick -> filled, check for hint completion
// highlight tile onhover
// highlight faintly row / col of tile onhover

// get hints
// Knows the solutionArr (can be passed to board, maybe not needed though)
// Secondary gameArr, same size as solutionArr, manages the users' progress
// Tiles use callbacks to functions within when onClick / onContextMenu
// gameArr passed to Board, making Board purely for displaying

// not rerendering when props change because of reference to solutionArr being the same, doesn't do a deep check for equality ?
export const PicrossProvider = ({ solutionArr }) => {
  console.clear();

  const fillState = {
    empty: '',
    filled: 'filled',
    error: 'error',
    marked: 'marked'
  };
  const [gameArr, setGameArr] = useState(CreateGameArray(solutionArr, fillState));

  let hintObj = CreateHintObj(solutionArr);
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

  useEffect(() => {
    let updatedGameArr = CopyGameArray(gameArr);
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
    setGameArr(updatedGameArr);
  }, []);

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

  return (
    <>
      <Board gameArr={gameArr} hintObj={hintObj} fillTile={fillTile} markTile={markTile} />
    </>
  );
}

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
  console.log(rowHintArr);
  console.log(colHintArr);

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