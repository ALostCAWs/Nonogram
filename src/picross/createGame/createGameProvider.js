/* ---- Imports Section */
import React, { useState, useEffect } from 'react';
import { fillState } from '../state.js';
// Components
import App from '../../App.js';
import { Board } from '../boardDisplay/board.js';
// Functions
import { exportGame } from '../gameImportExport/exportGame.js';
import { checkGameNotBlank } from '../boardDisplay/getBoardInfo.js';
/* End ---- */

/* ---- Create Game by providing user with a blank board & allowing them to toggle tile fillState.filled */
// Call exportGame on submit
export const CreateGameProvider = ({ boardHeight, boardWidth }) => {
  const [currentGame, setCurrentGame] = useState(createBlankGame(boardHeight, boardWidth));
  const [submit, setSubmit] = useState(false);
  const [gameBlank, setGameBlank] = useState(true);

  useEffect(() => {
    setGameBlank(checkGameNotBlank(currentGame));
    console.log(gameBlank);
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
          }} disabled={gameBlank}>Export</button>
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