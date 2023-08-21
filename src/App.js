/* ---- Imports Section */
import React, { useState } from 'react';
import { PlayGame, importGame } from './picrossGame/gameImportExport/gameImport';
import { CreateGame, exportGame } from './picrossGame/gameImportExport/gameExport';
import logo from './logo.svg';
import './App.css';

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
        <CreateGame />
      )}
    </div>
  );
}

export default App;