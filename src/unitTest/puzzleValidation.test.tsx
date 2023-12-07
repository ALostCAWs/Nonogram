import { FILL_STATE } from "constants/fillState";
import { checkSolutionNotBlank, checkBoardNotBlank, checkPuzzleRectangular } from "functions/puzzleValidation";

const filled = FILL_STATE.FILLED;
const marked = FILL_STATE.MARKED;
const empty = FILL_STATE.EMPTY;
const error = FILL_STATE.ERROR;
const complete = 'complete';

const puzzleSolution5x5 = [[true, true, true, true, true],
[false, true, true, false, false],
[false, true, false, true, false],
[false, true, true, false, false],
[false, true, true, false, false]];

it('ensures the given puzzleSolution is not blank', () => {
  let blankPuzzleSolution = [[false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false]];
  const resultBlankSolution = checkSolutionNotBlank(blankPuzzleSolution);
  expect(resultBlankSolution).toEqual(false);

  let blank5x5Puzzle = [[empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty]];
  const resultBlankPuzzle = checkBoardNotBlank(blank5x5Puzzle);
  expect(resultBlankPuzzle).toEqual(false);

  let notBlank5x5Puzzle = [[filled, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty]];
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