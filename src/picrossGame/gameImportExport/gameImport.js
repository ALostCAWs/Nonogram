/* ---- Imports Section */
import React, { useState } from 'react';
import { PicrossProvider } from '../picrossProvider';

/* ---- Import Game via code entered into textbox on form */
// Call PicrossProvider onSubmit
export const PlayGame = () => {
  const [puzzleCode, setPuzzleCode] = useState('');
  const [submit, setSubmit] = useState(false);

  /* <- Handle Input Changes & Form Submission -> */
  const handleChange = (e) => {
    setPuzzleCode(e.target.value);
  }
  const handleSubmit = (e) => {
    setPuzzleCode(importGame(puzzleCode));
    setSubmit(true);
  }

  return (
    <>
      {!submit ? (
        <form action='' id='enterPuzzleCode'>
          <label htmlFor='puzzleCode'>Enter Code: </label>
          <input type='text' id='puzzleCode' name='puzzleCode' value={puzzleCode} onChange={handleChange} />
          <button type='button' id='submit' name='submit' onClick={() => handleSubmit()}>Play Puzzle</button>
        </form>
      ) : (
        <PicrossProvider gameSolution={puzzleCode} />)
      }
    </>
  );
}

export const importGame = (gameHash) => {
  console.log(gameHash);

  // Obtain the boards' width from the gameHash & remove it & the separater char from the string
  const spaceIndex = gameHash.indexOf('|');
  const boardWidth = gameHash.slice(0, spaceIndex);
  console.log(boardWidth);
  gameHash = gameHash.slice(spaceIndex + 1);

  // Use the boards' width to separate the remainder of the hash into strings of that length
  const hashRows = gameHash.match(new RegExp(`.{1,${boardWidth}}`, 'g'));

  // Build gameSolution as a 2D array
  // Each newly-separated string in hashRows represents a row on the borad, height / columns are not needed to generate the gameSolution
  let gameSolution = [];
  for (let i = 0; i < hashRows.length; i++) {
    let innerGameSolution = [];
    let hashVal = hashRows[i].split('');
    for (let i = 0; i < hashVal.length; i++) {
      let fillable = hashVal[i] === '1' ? true : false;
      innerGameSolution.push(fillable)
    }
    gameSolution.push(innerGameSolution);
  }
  return gameSolution;
}