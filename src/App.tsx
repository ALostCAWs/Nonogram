/* ---- Imports Section */
import React, { useState, useRef } from 'react';
// Contexts
import { GameModeContext } from 'contexts/gameModeContext';
// Constants
import { GAME_MODE_STATE } from 'constants/gameModeState';
// Components
import { PlayGame } from 'pages/playGame';
import { CreateNonogramProvider } from 'components/providers/createNonogramProvider';
// Functions
import { importPuzzle } from 'functions/importPuzzle';
import { exportPuzzle } from 'functions/exportPuzzle';
import { getPuzzleByColumn } from 'functions/getPuzzleInfo';
import logo from './logo.svg';
import './App.css';
/* End ---- */

const puzzleSolution5x5 = [[true, true, true, true, true],
[false, true, true, false, false],
[false, true, false, true, false],
[false, true, true, false, false],
[false, true, true, false, false]];
const colPuzzle = getPuzzleByColumn(puzzleSolution5x5);
console.log('colPuzzle');
console.log(colPuzzle);

const gameSolution1 = [[true, true, true, true, true],
[false, true, true, false, false],
[false, true, false, true, false],
[false, true, true, false, false],
[false, true, false, false, false]];

const gameSolution2 = [[true, false, false, false, false],
[false, false, false, false, false],
[false, false, false, false, false],
[false, false, false, false, false],
[false, false, false, false, false]];

const gameSolution3 = [[false, true, true, false, true],
[false, true, true, false, false],
[false, true, false, true, false],
[false, true, true, false, false],
[false, true, false, false, false]];

export const App = () => {
  const [playPuzzle, setPlayPuzzle] = useState(false);
  const [createPuzzle, setCreatePuzzle] = useState(false);
  const boardHeight = useRef<HTMLSelectElement>(null);
  const boardWidth = useRef<HTMLSelectElement>(null);

  exportPuzzle(gameSolution1);
  exportPuzzle(gameSolution2);
  exportPuzzle(gameSolution3);
  return (
    <div className="App">
      {!playPuzzle && !createPuzzle && (
        <>
          <button type='button' className='playPuzzle button' onClick={() => setPlayPuzzle(true)}>Play</button>

          <select name="height" id="height" ref={boardHeight}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
          <select name="width" id="width" ref={boardWidth}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
          <button type='button' className='createPuzzle button' onClick={() => setCreatePuzzle(true)}>Create</button>
        </>
      )}
      {playPuzzle && (
        <GameModeContext.Provider value={GAME_MODE_STATE.PLAY}>
          <PlayGame />
        </GameModeContext.Provider>
      )}
      {createPuzzle && boardHeight.current !== null && boardWidth.current !== null && (
        <GameModeContext.Provider value={GAME_MODE_STATE.CREATE}>
          <CreateNonogramProvider boardHeight={parseInt(boardHeight.current.value)} boardWidth={parseInt(boardWidth.current.value)} />
        </GameModeContext.Provider>
      )}
    </div>
  );
}

export default App;