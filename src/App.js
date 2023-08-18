/* ---- Imports Section */
import React from 'react';
import { PicrossProvider } from './picrossGame/picrossProvider';
import logo from './logo.svg';
import './App.css';


let gameSolution1 = [[true, true, true, true, true],
[false, true, true, false, false],
[false, true, false, true, false],
[false, true, true, false, false],
[false, true, false, false, false]];

function App() {
  return (
    <div className="App">
      <PicrossProvider gameSolution={gameSolution1} />
    </div>
  );
}

export default App;
