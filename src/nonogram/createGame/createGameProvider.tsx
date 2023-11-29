/* ---- Imports Section */
import React, { useState, useEffect } from 'react';
import { fillState } from '../state.ts';
// Components
import App from '../../App.tsx';
import { Board } from '../boardDisplay/board.tsx';
// Functions
import { exportGame } from '../gameImportExport/exportGame.ts';
import { checkBoardNotBlank } from '../boardDisplay/getBoardInfo.ts';
/* End ---- */

/* ---- Create Game by providing user with a blank board & allowing them to toggle tile fillState.filled */
// Call exportGame on submit
interface CreateGameProviderProps {
  boardHeight: number,
  boardWidth: number,
}

export const CreateGameProvider = ({ boardHeight, boardWidth }: CreateGameProviderProps) => {
  const [currentGame, setCurrentGame] = useState<string[][]>(createBlankGame(boardHeight, boardWidth));
  const [submit, setSubmit] = useState<boolean>(false);
  const [gameBlank, setGameBlank] = useState<boolean>(true);

  useEffect(() => {
    setGameBlank(!checkBoardNotBlank(currentGame));
    console.log(gameBlank);
  }, [currentGame]);

  /* ---- Tile Interaction Functions */
  // R-click to toggle fillState filled / empty
  const fillTile = (e, rowIndex: number, colIndex: number): void => {
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
          <Board currentGame={currentGame} gameSolution={[]} livesCount={undefined} fillTile={fillTile} markTile={(e, rowIndex, colIndex) => { }} hoverTile={(e, rowIndex, colIndex) => { }} />
          <button type='button' className='export button' onClick={() => {
            let gameHash = createBoolGame(currentGame);
            navigator.clipboard.writeText(gameHash);
            setSubmit(true);
          }} disabled={gameBlank}>Export</button>
        </>
      )}
      {submit && (
        <>
          <App />
        </>
      )}
    </>
  );
}

const createBlankGame = (boardHeight: number, boardWidth: number): string[][] => {
  let blankGame: string[][] = [];
  for (let i = 0; i < boardHeight; i++) {
    let blankRow: string[] = [];
    for (let j = 0; j < boardWidth; j++) {
      blankRow.push(fillState.empty);
    }
    blankGame.push(blankRow);
  }
  return blankGame;
}

const createBoolGame = (currentGame: string[][]): string => {
  let gameSolution: boolean[][] = [];
  for (let i = 0; i < currentGame.length; i++) {
    let rowSolution: boolean[] = [];
    for (let j = 0; j < currentGame[0].length; j++) {
      let filled = currentGame[i][j] === fillState.filled ? true : false;
      rowSolution.push(filled);
    }
    gameSolution.push(rowSolution);
  }
  return exportGame(gameSolution);
}