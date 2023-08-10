/* ---- Imports Section */
import React, { useState, useEffect } from 'react';
import { object, array, bool } from 'prop-types';
import { Board, PicrossProvider } from './board.js';
import logo from './logo.svg';
import './App.css';


let solutionArr1 = [[true, true, true, true, true],
[true, true, true, false, true],
[true, true, false, true, false],
[true, true, true, false, true],
[false, false, false, false, false]];


function App() {
  return (
    <div className="App">
      <PicrossProvider solutionArr={solutionArr1} />
    </div>
  );
}

export default App;
