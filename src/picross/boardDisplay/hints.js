/* ---- Imports Section */
import React from 'react';
import { fillState, hintState } from '../state.js';
/* End ---- */

/* ---- Hint Text Display */
// Check if . . .
// Individual hint = gameHeight (col) gameWidth (row) & set to fullHint
// Hint array for a given col / row empty & set to zeroHint
// All hints for a given line are complete, add completed class to parent div
export const Hints = ({ lineGameSolution, currentLineGame, lineIndex, maxHintCount, lineType, updateHintClassName }) => {
  let hints = [];
  let hintCount = 0;
  let currentTilesInHintGameState = [];

  for (let j = 0; j < lineGameSolution.length; j++) {
    let solution = lineGameSolution[j];

    // Count col-adjacent trues, add current amount when false or when row end
    if (solution) {
      hintCount++;
      currentTilesInHintGameState.push(currentLineGame[j]);
    }

    // If at end of column/row or an unfillable tile is found & there is a hint counted, populate hint object
    if ((j === lineGameSolution.length - 1 || !solution) && hintCount !== 0) {
      // Default hintState setup for fullLineIncomplete & incomplete
      let state = hintCount === lineGameSolution.length ? hintState.fullLineIncomplete : hintState.incomplete;

      // Check if currentTilesInHintGameState ( now a Set => currentTilesInHintGameStateReduced ) contains one fillState.filled item
      let currentTilesInHintGameStateReduced = new Set(currentTilesInHintGameState);
      if (currentTilesInHintGameStateReduced.size === 1 && currentTilesInHintGameStateReduced.has(fillState.filled)) {
        state = hintState.complete;
      }

      // Push hint & reset to continue checking for potential hints
      let hint = {
        value: hintCount,
        state: state
      }
      hints.push(hint);
      hintCount = 0;
      currentTilesInHintGameState = [];
    }
  }
  // If hints for a line is empty, that entire line is empty
  if (hints.length === 0) {
    // Set hint zero value & state
    let hint = {
      value: 0,
      state: hintState.zero
    }
    hints.push(hint);
  }

  return (
    <>
      {lineType === 'col' && (
        <>
          {hints.map((hint, i) => <div key={`hint${lineIndex} - ${i}`} className={`${hint.state}`} style={{ height: `${100 / maxHintCount}%` }}>{hint.value}</div>)}
        </>
      )}
      {lineType === 'row' && (
        <>
          {hints.map((hint, i) => <div key={`hint${lineIndex} - ${i}`} className={`${hint.state}`} style={{ width: `${100 / maxHintCount}%` }}>{hint.value}</div>)}
        </>
      )}
    </>
  );
}