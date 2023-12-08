import { FILL_STATE } from "constants/fillState";
import { checkSolutionNotBlank, checkBoardNotBlank, checkPuzzleRectangular } from "functions/puzzleValidation";

const FILLED = FILL_STATE.FILLED;
const MARKED = FILL_STATE.MARKED;
const EMPTY = FILL_STATE.EMPTY;
const ERROR = FILL_STATE.ERROR;
const COMPLETE = 'complete';

const puzzleSolution5x5 = [[true, true, true, true, true],
[false, true, true, false, false],
[false, true, false, true, false],
[false, true, true, false, false],
[false, true, true, false, false]];

it('ensures the given puzzleSolution is not blank', () => {
  const blankPuzzleSolution = [[false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false]];
  const resultBlankSolution = checkSolutionNotBlank(blankPuzzleSolution);
  expect(resultBlankSolution).toEqual(false);

  const blank5x5Puzzle = [[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]];
  const resultBlankPuzzle = checkBoardNotBlank(blank5x5Puzzle);
  expect(resultBlankPuzzle).toEqual(false);

  const notBlank5x5Puzzle = [[FILLED, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]];
  const resultNotBlankPuzzle = checkBoardNotBlank(notBlank5x5Puzzle);
  expect(resultNotBlankPuzzle).toEqual(true);

  const resultNotBlankSolution = checkSolutionNotBlank(puzzleSolution5x5);
  expect(resultNotBlankSolution).toEqual(true);
});

it('ensures the given puzzleSolution is rectangular', () => {
  const resultRectangle = checkPuzzleRectangular(puzzleSolution5x5);
  expect(resultRectangle).toEqual(true);

  const irregularRow0puzzleSolution = [[true, true, true, true],
  [false, true, true, false, false],
  [false, true, false, true, false],
  [false, true, true, false, false],
  [false, true, true, false, false]];
  const resultNotRectangleFirstRow = checkPuzzleRectangular(irregularRow0puzzleSolution);
  expect(resultNotRectangleFirstRow).toEqual(false);

  const irregularRow4puzzleSolution = [[true, true, true, true, true],
  [false, true, true, false, false],
  [false, true, false, true, false],
  [false, true, true, false, false],
  [false, true, true, false]];
  const resultNotRectangleLastRow = checkPuzzleRectangular(irregularRow4puzzleSolution);
  expect(resultNotRectangleLastRow).toEqual(false);
});