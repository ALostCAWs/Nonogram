/* ---- Imports Section */
import React, { useState, useEffect } from 'react';
import { fillState } from '../state';
// Components
import App from '../../App';
import { Board } from '../boardDisplay/board';
// Functions
import { exportGame } from '../gameImportExport/exportGame';
import { copyCurrentGame } from '../gameSetup';
/* End ---- */

/* ---- Create Game by providing user with a blank board & allowing them to toggle tile fillState.filled */
// Call exportGame on submit
export const CreateGameProvider = ({ boardHeight, boardWidth }) => {
  console.log(boardHeight);
  console.log(boardWidth);
  const [currentGame, setCurrentGame] = useState(createBlankGame(boardHeight, boardWidth));
  //const [puzzleCode, setPuzzleCode] = useState('');
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    console.log(currentGame);
  }, [currentGame]);

  /* ---- Tile Interaction Functions */
  // R-click to toggle fillState filled / empty
  const fillTile = (e, rowIndex, colIndex) => {
    setCurrentGame(game => {
      return game.map((row, i) => {
        return row.map((fill, j) => {
          if (rowIndex === i && colIndex === j) {
            return fill === fillState.empty ? fillState.filled : fillState.empty;
          } else {
            return fill;
          }
        });
      });
    });
  }
  // Add submit button under provider
  return (
    <>
      {!submit && (
        <>
        <Board currentGame={currentGame} fillTile={fillTile} />
        <button type='button' className='export button' onClick={() => {
          let gameHash = createBoolGame(currentGame);
          navigator.clipboard.writeText(gameHash);
          setSubmit(true);
        }}>Export</button>
        </>
      )}
      {submit &&(
        <>
          <App />
        </>
      )}
    </>
  );
}

const createBlankGame = (boardHeight, boardWidth) => {
  let blankGame = [];
  for (let i = 0; i < boardHeight; i++) {
    let blankRow = [];
    for (let j = 0; j < boardWidth; j++) {
      blankRow.push(fillState.empty);
    }
    blankGame.push(blankRow);
  }
  return blankGame;
}

const createBoolGame = (currentGame) => {
  let gameSolution = [];
  for (let i = 0; i < currentGame.length; i++) {
    let rowSolution = [];
    for (let j = 0; j < currentGame[0].length; j++) {
      let filled = currentGame[i][j] === fillState.filled ? true : false;
      rowSolution.push(filled);
    }
    gameSolution.push(rowSolution);
  }
  return exportGame(gameSolution);
}