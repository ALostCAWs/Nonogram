/* ---- Imports Section */
import React from 'react';
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
  const gameSolution = decodeGameHash(encodeGameHAsh(gameSolution2));
  return (
    <div className="App">
      <ImportGame />
    </div>
  );
}

export default App;