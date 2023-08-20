/* ---- Imports Section */
import React from 'react';
import { PicrossProvider } from './picrossGame/picrossProvider';
import { gameImport } from './picrossGame/gameImportExport/gameImport';
import { gameExport } from './picrossGame/gameImportExport/gameExport';
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

let game3Str = '[[false,true,true,false,true],[false,true,true,false,false],[false,true,false,true,false],[false,true,true,false,false],[false,true,false,false,false]]';

function App() {
  const gameSolution = gameImport(gameExport(gameSolution1));
  return (
    <div className="App">
      <PicrossProvider gameSolution={gameSolution} />
    </div>
  );
}

export default App;