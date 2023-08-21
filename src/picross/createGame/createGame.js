/* ---- Imports Section */
import React, { useState, useEffect } from 'react';
// Components
import { CreateGameProvider } from './createGameProvider';
// Functions
import { exportGame } from '../gameImportExport/exportGame';
/* End ---- */

/* ---- Create Game by providing user with a blank board & allowing them to toggle tile fillState.filled */
// Call exportGame on submit
export const CreateGame = () => {
  const [puzzleCode, setPuzzleCode] = useState('');
  const [submit, setSubmit] = useState(false);

  // useEffect trigger on first render
  useEffect(() => {
    // Create blank board ( fillState.empty values only ) based on height / width chosen
  }, []);

  const boardHeight = 5;
  const boardWidth = 5;

  /* <- Handle Puzzle Submission -> */
  const handleSubmit = (e) => {
    setPuzzleCode(exportGame(puzzleCode));
    setSubmit(true);
    // Take user to page where they can copy their puzzles' code after exporting
    // Include copy button
  }

  return (
    <>
      <CreateGameProvider />
    </>
  );
}