/* ---- Imports Section */
import React, { useState } from 'react';
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

function App() {
  const [playPuzzle, setPlayPuzzle] = useState(false);
  const [createPuzzle, setCreatePuzzle] = useState(false);

  exportGame(gameSolution1);
  exportGame(gameSolution2);
  exportGame(gameSolution3);
  return (
    <div className="App">
      {!playPuzzle && !createPuzzle && (
        <>
          <button type='button' className='playPuzzle button' onClick={() => setPlayPuzzle(true)}>Play</button>
          <button type='button' className='createPuzzle button' onClick={() => setCreatePuzzle(true)}>Create</button>
        </>
      )}
      {playPuzzle && (
        <PlayGame />
      )}
      {createPuzzle && (
        <CreateGameProvider />
      )}
    </div>
  );
}

export default App;