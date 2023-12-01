import { fillState } from "constants/fillState";
import { checkSolutionNotBlank, checkBoardNotBlank, checkPuzzleRectangular } from "functions/puzzleValidation";
import { checkLineComplete, checkPuzzleComplete, checkGameOver, checkTileFillable, checkTileMarkable, getColumn, getPuzzleByColumn, getLongestDimension, getMaxHintCountByLineLength } from "functions/getPuzzleInfo";

const filled = fillState.filled;
const marked = fillState.marked;
const empty = fillState.empty;
const error = fillState.error;
const complete = 'complete';

const puzzleSolution5x5 = [[true, true, true, true, true],
[false, true, true, false, false],
[false, true, false, true, false],
[false, true, true, false, false],
[false, true, true, false, false]];

// Puzzle validation
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

// Completion check
it('checks if a given column / row is complete by comparing currentPuzzle to puzzleSolution', () => {
  const mixedLine = [filled, empty, empty, empty, empty];
  const mixedLineSolution = [true, false, false, false, false];
  const mixedLineComplete = checkLineComplete(mixedLineSolution, mixedLine);
  expect(mixedLineComplete).toEqual(true);

  const fullLine = [filled, filled, filled, filled, filled];
  const fullLineSolution = [true, true, true, true, true];
  const fullLineComplete = checkLineComplete(fullLineSolution, fullLine);
  expect(fullLineComplete).toEqual(true);

  const emptyLine = [empty, empty, empty, empty, empty];
  const emptyLineSolution = [false, false, false, false, false];
  const emptyLineComplete = checkLineComplete(emptyLineSolution, emptyLine);
  expect(emptyLineComplete).toEqual(true);

  const errorLine = [error, error, error, error, error];
  const errorLineSolution = [false, false, false, false, false];
  const errorLineComplete = checkLineComplete(errorLineSolution, errorLine);
  expect(errorLineComplete).toEqual(true);

  const incompleteLine = [empty, empty, empty, empty, empty];
  const incompleteLineSolution = [true, false, false, false, false];
  const incompleteLineComplete = checkLineComplete(incompleteLineSolution, incompleteLine);
  expect(incompleteLineComplete).toEqual(false);

  const markedLine = [marked, empty, empty, empty, empty];
  const markedLineSolution = [true, false, false, false, false];
  const markedLineComplete = checkLineComplete(markedLineSolution, markedLine);
  expect(markedLineComplete).toEqual(false);
});

it('checks if a given currentPuzzle is complete by comparing it to the puzzleSolution', () => {
  const puzzle5x5Complete = [[filled, filled, filled, filled, filled],
  [empty, filled, filled, empty, empty],
  [empty, filled, empty, filled, empty],
  [empty, filled, filled, empty, empty],
  [empty, filled, filled, empty, empty]];
  const puzzle5x5CompleteResult = checkPuzzleComplete(puzzleSolution5x5, puzzle5x5Complete);
  expect(puzzle5x5CompleteResult).toEqual(true);

  const puzzle5x5CompleteWithError = [[filled, filled, filled, filled, filled],
  [error, filled, filled, empty, empty],
  [empty, filled, empty, filled, empty],
  [empty, filled, filled, empty, empty],
  [empty, filled, filled, empty, empty]];
  const puzzle5x5CompleteWithErrorResult = checkPuzzleComplete(puzzleSolution5x5, puzzle5x5CompleteWithError);
  expect(puzzle5x5CompleteWithErrorResult).toEqual(true);

  const incompletePuzzle5x5Row0Complete = [[filled, filled, filled, filled, filled],
  [empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty]];
  const incompletePuzzle5x5Row0CompleteResult = checkPuzzleComplete(puzzleSolution5x5, incompletePuzzle5x5Row0Complete);
  expect(incompletePuzzle5x5Row0CompleteResult).toEqual(false);

  const incompletePuzzle5x5Column0Complete = [[filled, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty]];
  const incompletePuzzle5x5Column0CompleteResult = checkPuzzleComplete(puzzleSolution5x5, incompletePuzzle5x5Column0Complete);
  expect(incompletePuzzle5x5Column0CompleteResult).toEqual(false);

  const incompletePuzzle5x5Marked = [[marked, marked, marked, marked, marked],
  [empty, marked, marked, empty, empty],
  [empty, marked, empty, marked, empty],
  [empty, marked, marked, empty, empty],
  [empty, marked, marked, empty, empty]];
  const incompletePuzzle5x5MarkedResult = checkPuzzleComplete(puzzleSolution5x5, incompletePuzzle5x5Marked);
  expect(incompletePuzzle5x5MarkedResult).toEqual(false);
});

it('checks if the game is lost', () => {
  expect(checkGameOver(0)).toEqual(true);
  expect(checkGameOver(1)).toEqual(false);
});

// Tile checks
it('checks if a given tile is fillable', () => {
  expect(checkTileFillable(empty)).toEqual(true);

  expect(checkTileFillable(filled)).toEqual(false);
  expect(checkTileFillable(error)).toEqual(false);
  expect(checkTileFillable(marked)).toEqual(false);
  expect(checkTileFillable(complete)).toEqual(false);
});

it('checks if a given tile is markable', () => {
  expect(checkTileMarkable(empty)).toEqual(true);
  expect(checkTileMarkable(marked)).toEqual(true);

  expect(checkTileMarkable(filled)).toEqual(false);
  expect(checkTileMarkable(error)).toEqual(false);
  expect(checkTileMarkable(complete)).toEqual(false);
});

// Array quality of life
it('gets a column from the given puzzleSolution array using the given index', () => {
  const i = 2;
  const expectedColumn = [true, true, false, true, true];
  const result = getColumn(puzzleSolution5x5, i);
  expect(result).toEqual(expectedColumn);
});

it('returns a given puzzle flipped, allowing puzzle[n] to be used in order to obtain a column rather than a row', () => {
  const expectedPuzzleSolution5x5ByColumn = [[true, false, false, false, false],
  [true, true, true, true, true],
  [true, true, false, true, true],
  [true, false, true, false, false],
  [true, false, false, false, false]];
  const puzzleSolution5x5ByColumn = getPuzzleByColumn(puzzleSolution5x5);
  expect(puzzleSolution5x5ByColumn).toEqual(expectedPuzzleSolution5x5ByColumn);
});

it(`returns the length of the boards' longest dimension`, () => {
  const puzzleSolution10x5 = [[true, true, true, true, true, true, true, true, true, true],
  [false, true, true, false, false, false, true, true, false, false],
  [false, true, false, true, false, false, true, false, true, false],
  [false, true, true, false, false, false, true, true, false, false],
  [false, true, false, false, false, false, true, false, false, false]];

  const expectedLength = 10;
  const result = getLongestDimension(puzzleSolution10x5);
  expect(result).toEqual(expectedLength);
});

it(`returns the max hint count based on the given line length`, () => {
  const expectedMaxHintCount = 3;
  const result = getMaxHintCountByLineLength(5);
  expect(result).toEqual(expectedMaxHintCount);
});