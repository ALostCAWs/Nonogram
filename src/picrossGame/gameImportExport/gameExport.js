/* ---- Imports Section */
import React, { useState, useEffect } from 'react';
import { PicrossProvider } from '../picrossProvider';

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
    </>
  );
}

export const exportGame = (gameSolution) => {
  // First item is separated from the rest of the string with a pipe (|), this is the boards' width
  let gameHash = `${String(gameSolution[0].length)}|`;

  // Loop 2D gameSolution, adding on to create a simple string based on the arrays' info
  for (let i = 0; i < gameSolution.length; i++) {
    for (let j = 0; j < gameSolution[i].length; j++) {
      let hashItem = gameSolution[i][j] ? '1' : '0';
      gameHash += hashItem;
    }
  }
  return gameHash;
}