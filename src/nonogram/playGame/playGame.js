/* ---- Imports Section */
import React, { useState, useRef } from 'react';
// Components
import { NonogramProvider } from '../playGame/nonogramProvider.js';
// Functions
import { importGame } from '../gameImportExport/importGame.js';
import { checkGameNotBlank, checkGameRectangular } from '../boardDisplay/getBoardInfo.js';
/* End ---- */

/* ---- Import Game via code entered into textbox on form */
// Call NonogramProvider onSubmit
export const PlayGame = () => {
  const [submit, setSubmit] = useState(false);
  const gameCode = useRef();
  const gameSolution = useRef();

  /* <- Handle Input Changes & Form Submission -> */
  const handleSubmit = async (e) => {
    let errorMsg = '';
    gameSolution.current = await importGame(gameCode.current.value);

    if (!checkGameNotBlank(gameSolution.current)) {
      errorMsg += 'Invalid Code. Code entered results in a blank puzzle.\n';
    }
    if (!checkGameRectangular(gameSolution.current)) {
      errorMsg += 'Invalid Code. Code entered results in an irregularly shaped puzzle.\n';
    }

    if (errorMsg === '') {
      setSubmit(true);
    } else {
      alert(errorMsg);
    }
  }

  return (
    <>
      {!submit ? (
        <form action='' id='enterGameCode'>
          <label htmlFor='gameCode'>Enter Code: </label>
          <input type='text' id='gameCode' data-testid={'gameCode'} name='gameCode' ref={gameCode} />
          <button type='button' id='submit' name='submit' onClick={() => handleSubmit()}>Play Puzzle</button>
        </form>
      ) : (
          <NonogramProvider gameSolution={gameSolution.current} />
      )}
    </>
  );
}