/* ---- Imports Section */
import React, { useState, useRef } from 'react';
// Components
import { PicrossProvider } from '../playGame/picrossProvider';
// Functions
import { importGame } from '../gameImportExport/importGame';
/* End ---- */

/* ---- Import Game via code entered into textbox on form */
// Call PicrossProvider onSubmit
export const PlayGame = () => {
  const [submit, setSubmit] = useState(false);
  const gameCode = useRef();
  const gameSolution = useRef();

  /* <- Handle Input Changes & Form Submission -> */
  const handleSubmit = (e) => {
    gameSolution.current = importGame(gameCode.current.value);
    setSubmit(true);
  }

  return (
    <>
      {!submit ? (
        <form action='' id='enterGameCode'>
          <label htmlFor='gameCode'>Enter Code: </label>
          <input type='text' id='gameCode' name='gameCode' ref={gameCode} />
          <button type='button' id='submit' name='submit' onClick={() => handleSubmit()}>Play Puzzle</button>
        </form>
      ) : (
          <PicrossProvider gameSolution={gameSolution.current} />
      )}
    </>
  );
}