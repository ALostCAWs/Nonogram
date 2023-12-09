import { render, screen } from "@testing-library/react";
import { FILL_STATE } from "constants/fillState";
import { HINT_STATE } from "constants/hintState";
import { Hints } from 'components/ui/hints';
import { getPuzzleByColumn } from 'functions/getPuzzleInfo';
import { convertPuzzleToCurrentPuzzleType } from "functions/convertToCurrentPuzzleType";

const FILLED = FILL_STATE.FILLED;
const ERROR = FILL_STATE.ERROR;
const EMPTY = FILL_STATE.EMPTY

const FULL_LINE_HINT = HINT_STATE.FULL_LINE_INCOMPLETE;
const ZERO_HINT = HINT_STATE.ZERO;
const COMPLETE_HINT = HINT_STATE.COMPLETE;

let puzzleSolution5x5_ColTest = [[true, true, true, true, false],
[true, true, false, false, false],
[true, true, false, true, false],
[true, true, true, false, false],
[true, false, false, false, false]];
puzzleSolution5x5_ColTest = getPuzzleByColumn(puzzleSolution5x5_ColTest);

const currentPuzzle5x5_ColTest_String = [[EMPTY, EMPTY, EMPTY, EMPTY, ERROR],
[EMPTY, FILLED, EMPTY, EMPTY, ERROR],
[EMPTY, FILLED, EMPTY, FILLED, ERROR],
[EMPTY, EMPTY, EMPTY, EMPTY, ERROR],
[EMPTY, EMPTY, EMPTY, EMPTY, ERROR]];
const currentPuzzle5x5_ColTest = getPuzzleByColumn(convertPuzzleToCurrentPuzzleType(currentPuzzle5x5_ColTest_String));

const puzzleSolution5x5_RowTest = [[true, true, true, true, true],
[false, true, false, false, false],
[false, true, false, true, true],
[true, true, true, false, true],
[false, false, false, false, false]];

const currentPuzzle5x5_RowTest_String = [[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
[EMPTY, FILLED, EMPTY, EMPTY, EMPTY],
[EMPTY, FILLED, EMPTY, FILLED, EMPTY],
[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [ERROR, ERROR, ERROR, ERROR, ERROR]];
const currentPuzzle5x5_RowTest = convertPuzzleToCurrentPuzzleType(currentPuzzle5x5_RowTest_String);

// 0 hints are red
// Full hints are highlighted
// Complete hints are greyed
// Correct associated hint is greyed

/* ---- Initialization Tests */
it('initializes a standard hint as black', () => {
  const index = 1;
  render(<Hints puzzleSolutionLine={puzzleSolution5x5_RowTest[index]} currentPuzzleLine={currentPuzzle5x5_RowTest[index]} lineIndex={index} maxHintCount={3} lineType={'row'} />);

  expect(screen.getByTestId(`hint${index} - 0`)).not.toHaveClass(FULL_LINE_HINT, ZERO_HINT, COMPLETE_HINT);
  expect(screen.getByTestId(`hint${index} - 0`)).toHaveTextContent('1');
});

it('initializes multiple standard hints as black', () => {
  const index = 3;
  render(<Hints puzzleSolutionLine={puzzleSolution5x5_RowTest[index]} currentPuzzleLine={currentPuzzle5x5_RowTest[index]} lineIndex={index} maxHintCount={3} lineType={'row'} />);
  expect(screen.getByTestId(`hint${index} - 0`)).toHaveTextContent('3');
  expect(screen.getByTestId(`hint${index} - 0`)).not.toHaveClass(FULL_LINE_HINT, ZERO_HINT, COMPLETE_HINT);
  expect(screen.getByTestId(`hint${index} - 1`)).toHaveTextContent('1');
  expect(screen.getByTestId(`hint${index} - 1`)).not.toHaveClass(FULL_LINE_HINT, ZERO_HINT, COMPLETE_HINT);
});

it('initializes empty column hints as 0 with zeroHint class', () => {
  const index = 4;
  render(<Hints puzzleSolutionLine={puzzleSolution5x5_ColTest[index]} currentPuzzleLine={currentPuzzle5x5_ColTest[index]} lineIndex={index} maxHintCount={3} lineType={'col'} />);

  expect(screen.getByTestId(`hint${index} - 0`)).toHaveClass(ZERO_HINT);
  expect(screen.getByTestId(`hint${index} - 0`)).not.toHaveClass(FULL_LINE_HINT, COMPLETE_HINT);
  expect(screen.getByTestId(`hint${index} - 0`)).toHaveTextContent('0');
});

it('initializes empty row hints as 0 with zeroHint class', () => {
  const index = 4;
  render(<Hints puzzleSolutionLine={puzzleSolution5x5_RowTest[index]} currentPuzzleLine={currentPuzzle5x5_RowTest[index]} lineIndex={index} maxHintCount={3} lineType={'row'} />);

  expect(screen.getByTestId(`hint${index} - 0`)).toHaveClass(ZERO_HINT);
  expect(screen.getByTestId(`hint${index} - 0`)).not.toHaveClass(FULL_LINE_HINT, COMPLETE_HINT);
  expect(screen.getByTestId(`hint${index} - 0`)).toHaveTextContent('0');
});

it('initializes full column hints with fullLineHint class', () => {
  const index = 0;
  render(<Hints puzzleSolutionLine={puzzleSolution5x5_ColTest[index]} currentPuzzleLine={currentPuzzle5x5_ColTest[index]} lineIndex={index} maxHintCount={3} lineType={'col'} />);

  expect(screen.getByTestId(`hint${index} - 0`)).toHaveClass(FULL_LINE_HINT);
  expect(screen.getByTestId(`hint${index} - 0`)).not.toHaveClass(ZERO_HINT, COMPLETE_HINT);
  expect(screen.getByTestId(`hint${index} - 0`)).toHaveTextContent('5');
});

it('initializes full row hints with fullLineHint class', () => {
  const index = 0;
  render(<Hints puzzleSolutionLine={puzzleSolution5x5_RowTest[index]} currentPuzzleLine={currentPuzzle5x5_RowTest[index]} lineIndex={index} maxHintCount={3} lineType={'row'} />);

  expect(screen.getByTestId(`hint${index} - 0`)).toHaveClass(FULL_LINE_HINT);
  expect(screen.getByTestId(`hint${index} - 0`)).not.toHaveClass(ZERO_HINT, COMPLETE_HINT);
  expect(screen.getByTestId(`hint${index} - 0`)).toHaveTextContent('5');
});

/* ---- Responding to changes tests */
// Hint greys when it's associated tiles are filled
// Full line complete, one complete, all complete
// Col & row
it(`greys out a rows' hint when its' corresponding tiles are filled`, () => {
  const currentPuzzle5x5_GreyHints_RowTest_String = [[FILLED, FILLED, FILLED, FILLED, FILLED],
  [EMPTY, FILLED, EMPTY, EMPTY, EMPTY],
  [EMPTY, FILLED, EMPTY, FILLED, EMPTY],
  [FILLED, FILLED, FILLED, EMPTY, FILLED],
    [ERROR, ERROR, ERROR, ERROR, ERROR]];
  const currentPuzzle5x5_GreyHints_RowTest = convertPuzzleToCurrentPuzzleType(currentPuzzle5x5_GreyHints_RowTest_String);

  // 0 - hint index 0 Complete, full line
  const fullLineIndex = 0;
  render(<Hints puzzleSolutionLine={puzzleSolution5x5_RowTest[fullLineIndex]} currentPuzzleLine={currentPuzzle5x5_GreyHints_RowTest[fullLineIndex]} lineIndex={fullLineIndex} maxHintCount={0} lineType={'row'} />);
  expect(screen.getByTestId(`hint${fullLineIndex} - 0`)).toHaveClass(COMPLETE_HINT);
  expect(screen.getByTestId(`hint${fullLineIndex} - 0`)).not.toHaveClass(FULL_LINE_HINT, ZERO_HINT);

  // 2 - hint index 0 Complete, hint index 1 Incomplete
  const oneHintCompleteIndex = 2;
  render(<Hints puzzleSolutionLine={puzzleSolution5x5_RowTest[oneHintCompleteIndex]} currentPuzzleLine={currentPuzzle5x5_GreyHints_RowTest[oneHintCompleteIndex]} lineIndex={oneHintCompleteIndex} maxHintCount={0} lineType={'row'} />);
  expect(screen.getByTestId(`hint${oneHintCompleteIndex} - 0`)).toHaveClass(COMPLETE_HINT);
  expect(screen.getByTestId(`hint${oneHintCompleteIndex} - 0`)).not.toHaveClass(FULL_LINE_HINT, ZERO_HINT);
  expect(screen.getByTestId(`hint${oneHintCompleteIndex} - 1`)).not.toHaveClass(FULL_LINE_HINT, ZERO_HINT, COMPLETE_HINT);

  // 3 - hint index 0 & 1 Complete
  const allHintCompleteIndex = 3;
  render(<Hints puzzleSolutionLine={puzzleSolution5x5_RowTest[allHintCompleteIndex]} currentPuzzleLine={currentPuzzle5x5_GreyHints_RowTest[allHintCompleteIndex]} lineIndex={allHintCompleteIndex} maxHintCount={0} lineType={'row'} />);
  expect(screen.getByTestId(`hint${allHintCompleteIndex} - 0`)).toHaveClass(COMPLETE_HINT);
  expect(screen.getByTestId(`hint${allHintCompleteIndex} - 0`)).not.toHaveClass(FULL_LINE_HINT, ZERO_HINT);
  expect(screen.getByTestId(`hint${allHintCompleteIndex} - 1`)).toHaveClass(COMPLETE_HINT);
  expect(screen.getByTestId(`hint${allHintCompleteIndex} - 1`)).not.toHaveClass(FULL_LINE_HINT, ZERO_HINT);
});

it(`greys out a columns' hint when its' corresponding tiles are filled`, () => {
  const currentPuzzle5x5_GreyHints_ColTest_String = [[FILLED, FILLED, EMPTY, FILLED, ERROR],
  [FILLED, FILLED, EMPTY, EMPTY, ERROR],
  [FILLED, FILLED, EMPTY, FILLED, ERROR],
  [FILLED, FILLED, FILLED, EMPTY, ERROR],
  [FILLED, EMPTY, EMPTY, EMPTY, ERROR]];
  const currentPuzzle5x5_GreyHints_ColTest = getPuzzleByColumn(convertPuzzleToCurrentPuzzleType(currentPuzzle5x5_GreyHints_ColTest_String));

  // 0 - hint index 0 Complete, full line
  const fullLineIndex = 0;
  render(<Hints puzzleSolutionLine={puzzleSolution5x5_ColTest[fullLineIndex]} currentPuzzleLine={currentPuzzle5x5_GreyHints_ColTest[fullLineIndex]} lineIndex={fullLineIndex} maxHintCount={0} lineType={'col'} />);
  expect(screen.getByTestId(`hint${fullLineIndex} - 0`)).toHaveClass(COMPLETE_HINT);
  expect(screen.getByTestId(`hint${fullLineIndex} - 0`)).not.toHaveClass(FULL_LINE_HINT, ZERO_HINT);

  // 1 - hint index 1 Incomplete, hint index 0 Complete
  const oneHintCompleteIndex = 2;
  render(<Hints puzzleSolutionLine={puzzleSolution5x5_ColTest[oneHintCompleteIndex]} currentPuzzleLine={currentPuzzle5x5_GreyHints_ColTest[oneHintCompleteIndex]} lineIndex={oneHintCompleteIndex} maxHintCount={0} lineType={'col'} />);
  expect(screen.getByTestId(`hint${oneHintCompleteIndex} - 0`)).not.toHaveClass(FULL_LINE_HINT, ZERO_HINT, COMPLETE_HINT);
  expect(screen.getByTestId(`hint${oneHintCompleteIndex} - 1`)).toHaveClass(COMPLETE_HINT);
  expect(screen.getByTestId(`hint${oneHintCompleteIndex} - 1`)).not.toHaveClass(FULL_LINE_HINT, ZERO_HINT);

  // 3 - hint index 0 & 1 Complete
  const allHintCompleteIndex = 3;
  render(<Hints puzzleSolutionLine={puzzleSolution5x5_ColTest[allHintCompleteIndex]} currentPuzzleLine={currentPuzzle5x5_GreyHints_ColTest[allHintCompleteIndex]} lineIndex={allHintCompleteIndex} maxHintCount={0} lineType={'col'} />);
  expect(screen.getByTestId(`hint${allHintCompleteIndex} - 0`)).toHaveClass(COMPLETE_HINT);
  expect(screen.getByTestId(`hint${allHintCompleteIndex} - 0`)).not.toHaveClass(FULL_LINE_HINT, ZERO_HINT);
  expect(screen.getByTestId(`hint${allHintCompleteIndex} - 1`)).toHaveClass(COMPLETE_HINT);
  expect(screen.getByTestId(`hint${allHintCompleteIndex} - 1`)).not.toHaveClass(FULL_LINE_HINT, ZERO_HINT);
});