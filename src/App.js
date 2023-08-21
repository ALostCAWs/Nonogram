/* ---- Imports Section */
import React, { useState } from 'react';
import { ImportGame, decodeGameHash } from './picrossGame/gameImportExport/gameImport';
import { encodeGameHAsh } from './picrossGame/gameImportExport/gameExport';
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

  decodeGameHash(encodeGameHAsh(gameSolution1));
  decodeGameHash(encodeGameHAsh(gameSolution2));
  decodeGameHash(encodeGameHAsh(gameSolution3));
  return (
    <div className="App">
      {!playPuzzle && !createPuzzle && (
        <>
          <button type='button' className='playPuzzle button' onClick={() => setPlayPuzzle(true)}>Play</button>
          <button type='button' className='createPuzzle button' onClick={() => setCreatePuzzle(true)}>Create</button>
        </>
      )}
      {playPuzzle && (
        <ImportGame />
      )}
      {createPuzzle && (
        <ImportGame />
      )}
    </div>
  );
}

export default App;