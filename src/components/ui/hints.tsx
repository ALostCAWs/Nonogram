/* ---- Imports Section */
import React from 'react';
import { fillState } from 'constants/fillState';
import { hintState } from 'constants/hintState';
/* End ---- */

/* ---- Hint Text Display */
// Check if . . .
// Individual hint = puzzleHeight (col) puzzleWidth (row) & set to fullHint
// Hint array for a given col / row empty & set to zeroHint
// All hints for a given line are complete, add completed class to parent div
interface HintsProps {
  puzzleSolutionLine: boolean[],
  currentPuzzleLine: string[],
  lineIndex: number,
  maxHintCount: number,
  lineType: string
}

interface Hint {
  value: number,
  state: string
}

export const Hints = ({ puzzleSolutionLine, currentPuzzleLine, lineIndex, maxHintCount, lineType }: HintsProps) => {
  let hints: Hint[] = [];
  let hintCount = 0;
  let currentTilesInHintFillState: string[] = [];

  for (let j = 0; j < puzzleSolutionLine.length; j++) {
    let solution = puzzleSolutionLine[j];

    // Count col-adjacent trues, add current amount when false or when row end
    if (solution) {
      hintCount++;
      currentTilesInHintFillState.push(currentPuzzleLine[j]);
    }

    // If at end of column/row or an unfillable tile is found & there is a hint counted, populate hint object
    if ((j === puzzleSolutionLine.length - 1 || !solution) && hintCount !== 0) {
      // Default hintState setup for fullLineIncomplete & incomplete
      let state = hintCount === puzzleSolutionLine.length ? hintState.fullLineIncomplete : hintState.incomplete;

      // Check if currentTilesInHintFillState ( now a Set => currentTilesInHintFillStateReduced ) contains one fillState.filled item
      let currentTilesInHintFillStateReduced = new Set(currentTilesInHintFillState);
      if (currentTilesInHintFillStateReduced.size === 1 && currentTilesInHintFillStateReduced.has(fillState.filled)) {
        state = hintState.complete;
      }

      // Push hint & reset to continue checking for potential hints
      let hint = {
        value: hintCount,
        state: state
      }
      hints.push(hint);
      hintCount = 0;
      currentTilesInHintFillState = [];
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
          {hints.map((hint, i) => <div data-testid={`hint${lineIndex} - ${i}`} key={`hint${lineIndex} - ${i}`} className={`${hint.state}`} style={{ height: `${100 / maxHintCount}%` }}>{hint.value}</div>)}
        </>
      )}
      {lineType === 'row' && (
        <>
          {hints.map((hint, i) => <div data-testid={`hint${lineIndex} - ${i}`} key={`hint${lineIndex} - ${i}`} className={`${hint.state}`} style={{ width: `${100 / maxHintCount}%` }}>{hint.value}</div>)}
        </>
      )}
    </>
  );
}