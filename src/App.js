/* ---- Imports Section */
import React, { useState, useRef } from 'react';
// Components
import { PlayGame } from './picross/playGame/playGame';
import { CreateGameProvider } from './picross/createGame/createGameProvider';
// Functions
import { importGame } from './picross/gameImportExport/importGame';
import { exportGame } from './picross/gameImportExport/exportGame';
import logo from './logo.svg';
import './App.css';
/* End ---- */

let gameSolution1 = [[true, true, true, true, true],
[false, true, true, false, false],
[false, true, false, true, false],
[false, true, true, false, false],
[false, true, false, false, false]];

let gameSolution2 = [[true, false, false, false, false],
[false, false, false, false, false],
[false, false, false, false, false],
[false, false, false, false, false],
[false, false, false, false, false]];

let gameSolution3 = [[false, true, true, false, true],
[false, true, true, false, false],
[false, true, false, true, false],
[false, true, true, false, false],
[false, true, false, false, false]];

const App = () => {
  const [playPuzzle, setPlayPuzzle] = useState(false);
  const [createPuzzle, setCreatePuzzle] = useState(false);
  const boardHeight = useRef();
  const boardWidth = useRef();

  exportGame(gameSolution1);
  exportGame(gameSolution2);
  exportGame(gameSolution3);
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
        <PlayGame />
      )}
      {createPuzzle && (
        <CreateGameProvider boardHeight={boardHeight.current.value} boardWidth={boardWidth.current.value} />
      )}
    </div>
  );
}

export default App;