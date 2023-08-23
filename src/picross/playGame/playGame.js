/* ---- Imports Section */
import React, { useState } from 'react';
// Components
import { PicrossProvider } from '../playGame/picrossProvider';
// Functions
import { importGame } from '../gameImportExport/importGame';
/* End ---- */

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