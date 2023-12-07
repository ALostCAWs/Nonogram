/* ---- Imports Section */
import React from 'react';
import { FILL_STATE } from 'constants/fillState';
import { HINT_STATE } from 'constants/hintState';
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
  const hints: Hint[] = [];
  let hintCount = 0;
  let currentTilesInHintFillState: string[] = [];

  for (let j = 0; j < puzzleSolutionLine.length; j++) {
    const solution = puzzleSolutionLine[j];

    // Count col-adjacent trues, add current amount when false or when row end
    if (solution) {
      hintCount++;
      currentTilesInHintFillState.push(currentPuzzleLine[j]);
    }

    // If at end of column/row or an unfillable tile is found & there is a hint counted, populate hint object
    if ((j === puzzleSolutionLine.length - 1 || !solution) && hintCount !== 0) {
      // Default hintState setup for fullLineIncomplete & incomplete
      let state = hintCount === puzzleSolutionLine.length ? HINT_STATE.FULL_LINE_INCOMPLETE : HINT_STATE.INCOMPLETE;

      // Check if currentTilesInHintFillState ( now a Set => currentTilesInHintFillStateReduced ) contains one fillState.filled item
      const currentTilesInHintFillStateReduced = new Set(currentTilesInHintFillState);
      if (currentTilesInHintFillStateReduced.size === 1 && currentTilesInHintFillStateReduced.has(FILL_STATE.FILLED)) {
        state = HINT_STATE.COMPLETE;
      }

      // Push hint & reset to continue checking for potential hints
      const hint = {
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
    const hint = {
      value: 0,
      state: HINT_STATE.ZERO
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