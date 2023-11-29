/* ---- Imports Section */
import React, { useState, useRef } from 'react';
// Components
import { NonogramProvider } from './nonogramProvider.tsx';
// Functions
import { importGame } from '../gameImportExport/importGame.ts';
import { checkSolutionNotBlank, checkGameRectangular } from '../boardDisplay/getBoardInfo.ts';
/* End ---- */

/* ---- Import Game via code entered into textbox on form */
// Call NonogramProvider onSubmit
export const PlayGame = () => {
  const [submit, setSubmit] = useState<boolean>(false);
  const gameCode = useRef<HTMLInputElement>(null);
  const gameSolution = useRef<boolean[][]>([]);

  /* <- Handle Input Changes & Form Submission -> */
  const handleSubmit = async (e: React.MouseEvent) => {
    let errorMsg = '';
    if (gameCode.current === null || gameCode.current === undefined || gameCode.current.value === '') {
      await fetch(`http://localhost:3001/puzzles/1`)
        .then(res => res.json())
        .then(puzzle => gameSolution.current = importGame(puzzle.puzzleCode));
    } else {
      gameSolution.current = importGame(gameCode.current.value);
    }

    if (!checkSolutionNotBlank(gameSolution.current)) {
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
          <button type='button' id='submit' name='submit' onClick={(e) => handleSubmit(e)}>Play Puzzle</button>
        </form>
      ) : (
        <NonogramProvider gameSolution={gameSolution.current} />
      )}
    </>
  );
}