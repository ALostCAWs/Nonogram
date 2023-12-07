/* ---- Imports Section */
import React from 'react';
import { render, screen } from "@testing-library/react";
import { FILL_STATE } from "constants/fillState";
import { HINT_STATE } from "constants/hintState";
// Components
import { Hints } from 'components/ui/hints';
// Functions
import { getPuzzleByColumn } from 'functions/getPuzzleInfo';
/* End ---- */

const filled = FILL_STATE.FILLED;
const error = FILL_STATE.ERROR;
const empty = FILL_STATE.EMPTY

const fullLineHint = HINT_STATE.FULL_LINE_INCOMPLETE;
const zeroHint = HINT_STATE.ZERO;
const completeHint = HINT_STATE.COMPLETE;

let puzzleSolution5x5_ColTest = [[true, true, true, true, false],
[true, true, false, false, false],
[true, true, false, true, false],
[true, true, true, false, false],
[true, false, false, false, false]];
puzzleSolution5x5_ColTest = getPuzzleByColumn(puzzleSolution5x5_ColTest);

let currentPuzzle5x5_ColTest = [[empty, empty, empty, empty, error],
[empty, filled, empty, empty, error],
[empty, filled, empty, filled, error],
[empty, empty, empty, empty, error],
[empty, empty, empty, empty, error]];
currentPuzzle5x5_ColTest = getPuzzleByColumn(currentPuzzle5x5_ColTest);

const puzzleSolution5x5_RowTest = [[true, true, true, true, true],
[false, true, false, false, false],
[false, true, false, true, true],
[true, true, true, false, true],
[false, false, false, false, false]];

const currentPuzzle5x5_RowTest = [[empty, empty, empty, empty, empty],
[empty, filled, empty, empty, empty],
[empty, filled, empty, filled, empty],
[empty, empty, empty, empty, empty],
[error, error, error, error, error]];

// 0 hints are red
// Full hints are highlighted
// Complete hints are greyed
// Correct associated hint is greyed

/* ---- Initialization Tests */
it('initializes a standard hint as black', () => {
  let index = 1;
  render(<Hints puzzleSolutionLine={puzzleSolution5x5_RowTest[index]} currentPuzzleLine={currentPuzzle5x5_RowTest[index]} lineIndex={index} maxHintCount={3} lineType={'row'} />);

  expect(screen.getByTestId(`hint${index} - 0`)).not.toHaveClass(fullLineHint, zeroHint, completeHint);
  expect(screen.getByTestId(`hint${index} - 0`)).toHaveTextContent('1');
});

it('initializes multiple standard hints as black', () => {
  let index = 3;
  render(<Hints puzzleSolutionLine={puzzleSolution5x5_RowTest[index]} currentPuzzleLine={currentPuzzle5x5_RowTest[index]} lineIndex={index} maxHintCount={3} lineType={'row'} />);
  expect(screen.getByTestId(`hint${index} - 0`)).toHaveTextContent('3');
  expect(screen.getByTestId(`hint${index} - 0`)).not.toHaveClass(fullLineHint, zeroHint, completeHint);
  expect(screen.getByTestId(`hint${index} - 1`)).toHaveTextContent('1');
  expect(screen.getByTestId(`hint${index} - 1`)).not.toHaveClass(fullLineHint, zeroHint, completeHint);
});

it('initializes empty column hints as 0 with zeroHint class', () => {
  let index = 4;
  render(<Hints puzzleSolutionLine={puzzleSolution5x5_ColTest[index]} currentPuzzleLine={currentPuzzle5x5_ColTest[index]} lineIndex={index} maxHintCount={3} lineType={'col'} />);

  expect(screen.getByTestId(`hint${index} - 0`)).toHaveClass(zeroHint);
  expect(screen.getByTestId(`hint${index} - 0`)).not.toHaveClass(fullLineHint, completeHint);
  expect(screen.getByTestId(`hint${index} - 0`)).toHaveTextContent('0');
});

it('initializes empty row hints as 0 with zeroHint class', () => {
  let index = 4;
  render(<Hints puzzleSolutionLine={puzzleSolution5x5_RowTest[index]} currentPuzzleLine={currentPuzzle5x5_RowTest[index]} lineIndex={index} maxHintCount={3} lineType={'row'} />);

  expect(screen.getByTestId(`hint${index} - 0`)).toHaveClass(zeroHint);
  expect(screen.getByTestId(`hint${index} - 0`)).not.toHaveClass(fullLineHint, completeHint);
  expect(screen.getByTestId(`hint${index} - 0`)).toHaveTextContent('0');
});

it('initializes full column hints with fullLineHint class', () => {
  let index = 0;
  render(<Hints puzzleSolutionLine={puzzleSolution5x5_ColTest[index]} currentPuzzleLine={currentPuzzle5x5_ColTest[index]} lineIndex={index} maxHintCount={3} lineType={'col'} />);

  expect(screen.getByTestId(`hint${index} - 0`)).toHaveClass(fullLineHint);
  expect(screen.getByTestId(`hint${index} - 0`)).not.toHaveClass(zeroHint, completeHint);
  expect(screen.getByTestId(`hint${index} - 0`)).toHaveTextContent('5');
});

it('initializes full row hints with fullLineHint class', () => {
  let index = 0;
  render(<Hints puzzleSolutionLine={puzzleSolution5x5_RowTest[index]} currentPuzzleLine={currentPuzzle5x5_RowTest[index]} lineIndex={index} maxHintCount={3} lineType={'row'} />);

  expect(screen.getByTestId(`hint${index} - 0`)).toHaveClass(fullLineHint);
  expect(screen.getByTestId(`hint${index} - 0`)).not.toHaveClass(zeroHint, completeHint);
  expect(screen.getByTestId(`hint${index} - 0`)).toHaveTextContent('5');
});

/* ---- Responding to changes tests */
// Hint greys when it's associated tiles are filled
// Full line complete, one complete, all complete
// Col & row
it(`greys out a rows' hint when its' corresponding tiles are filled`, () => {
  const currentPuzzle5x5_GreyHints_RowTest = [[filled, filled, filled, filled, filled],
  [empty, filled, empty, empty, empty],
  [empty, filled, empty, filled, empty],
  [filled, filled, filled, empty, filled],
  [error, error, error, error, error]];

  // 0 - hint index 0 Complete, full line
  let fullLineIndex = 0;
  render(<Hints puzzleSolutionLine={puzzleSolution5x5_RowTest[fullLineIndex]} currentPuzzleLine={currentPuzzle5x5_GreyHints_RowTest[fullLineIndex]} lineIndex={fullLineIndex} maxHintCount={0} lineType={'row'} />);
  expect(screen.getByTestId(`hint${fullLineIndex} - 0`)).toHaveClass(completeHint);
  expect(screen.getByTestId(`hint${fullLineIndex} - 0`)).not.toHaveClass(fullLineHint, zeroHint);

  // 2 - hint index 0 Complete, hint index 1 Incomplete
  let oneHintCompleteIndex = 2;
  render(<Hints puzzleSolutionLine={puzzleSolution5x5_RowTest[oneHintCompleteIndex]} currentPuzzleLine={currentPuzzle5x5_GreyHints_RowTest[oneHintCompleteIndex]} lineIndex={oneHintCompleteIndex} maxHintCount={0} lineType={'row'} />);
  expect(screen.getByTestId(`hint${oneHintCompleteIndex} - 0`)).toHaveClass(completeHint);
  expect(screen.getByTestId(`hint${oneHintCompleteIndex} - 0`)).not.toHaveClass(fullLineHint, zeroHint);
  expect(screen.getByTestId(`hint${oneHintCompleteIndex} - 1`)).not.toHaveClass(fullLineHint, zeroHint, completeHint);

  // 3 - hint index 0 & 1 Complete
  let allHintCompleteIndex = 3;
  render(<Hints puzzleSolutionLine={puzzleSolution5x5_RowTest[allHintCompleteIndex]} currentPuzzleLine={currentPuzzle5x5_GreyHints_RowTest[allHintCompleteIndex]} lineIndex={allHintCompleteIndex} maxHintCount={0} lineType={'row'} />);
  expect(screen.getByTestId(`hint${allHintCompleteIndex} - 0`)).toHaveClass(completeHint);
  expect(screen.getByTestId(`hint${allHintCompleteIndex} - 0`)).not.toHaveClass(fullLineHint, zeroHint);
  expect(screen.getByTestId(`hint${allHintCompleteIndex} - 1`)).toHaveClass(completeHint);
  expect(screen.getByTestId(`hint${allHintCompleteIndex} - 1`)).not.toHaveClass(fullLineHint, zeroHint);
});

it(`greys out a columns' hint when its' corresponding tiles are filled`, () => {
  let currentPuzzle5x5_GreyHints_ColTest = [[filled, filled, empty, filled, error],
  [filled, filled, empty, empty, error],
  [filled, filled, empty, filled, error],
  [filled, filled, filled, empty, error],
  [filled, empty, empty, empty, error]];
  currentPuzzle5x5_GreyHints_ColTest = getPuzzleByColumn(currentPuzzle5x5_GreyHints_ColTest);

  // 0 - hint index 0 Complete, full line
  let fullLineIndex = 0;
  render(<Hints puzzleSolutionLine={puzzleSolution5x5_ColTest[fullLineIndex]} currentPuzzleLine={currentPuzzle5x5_GreyHints_ColTest[fullLineIndex]} lineIndex={fullLineIndex} maxHintCount={0} lineType={'col'} />);
  expect(screen.getByTestId(`hint${fullLineIndex} - 0`)).toHaveClass(completeHint);
  expect(screen.getByTestId(`hint${fullLineIndex} - 0`)).not.toHaveClass(fullLineHint, zeroHint);

  // 1 - hint index 1 Incomplete, hint index 0 Complete
  let oneHintCompleteIndex = 2;
  render(<Hints puzzleSolutionLine={puzzleSolution5x5_ColTest[oneHintCompleteIndex]} currentPuzzleLine={currentPuzzle5x5_GreyHints_ColTest[oneHintCompleteIndex]} lineIndex={oneHintCompleteIndex} maxHintCount={0} lineType={'col'} />);
  expect(screen.getByTestId(`hint${oneHintCompleteIndex} - 0`)).not.toHaveClass(fullLineHint, zeroHint, completeHint);
  expect(screen.getByTestId(`hint${oneHintCompleteIndex} - 1`)).toHaveClass(completeHint);
  expect(screen.getByTestId(`hint${oneHintCompleteIndex} - 1`)).not.toHaveClass(fullLineHint, zeroHint);

  // 3 - hint index 0 & 1 Complete
  let allHintCompleteIndex = 3;
  render(<Hints puzzleSolutionLine={puzzleSolution5x5_ColTest[allHintCompleteIndex]} currentPuzzleLine={currentPuzzle5x5_GreyHints_ColTest[allHintCompleteIndex]} lineIndex={allHintCompleteIndex} maxHintCount={0} lineType={'col'} />);
  expect(screen.getByTestId(`hint${allHintCompleteIndex} - 0`)).toHaveClass(completeHint);
  expect(screen.getByTestId(`hint${allHintCompleteIndex} - 0`)).not.toHaveClass(fullLineHint, zeroHint);
  expect(screen.getByTestId(`hint${allHintCompleteIndex} - 1`)).toHaveClass(completeHint);
  expect(screen.getByTestId(`hint${allHintCompleteIndex} - 1`)).not.toHaveClass(fullLineHint, zeroHint);
});