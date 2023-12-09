import { FILL_STATE } from "constants/fillState";
import { convertLineToCurrentPuzzleType, convertPuzzleToCurrentPuzzleType } from "functions/convertToCurrentPuzzleType";
import { checkLineComplete, checkPuzzleComplete, checkGameOver, checkTileFillable, checkTileMarkable, getColumn, getPuzzleByColumn, getLongestDimension, getMaxHintCountByLineLength } from "functions/getPuzzleInfo";

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

// Completion check
it('checks if a given column / row is complete by comparing currentPuzzle to puzzleSolution', () => {
  const mixedLine_String = [FILLED, EMPTY, EMPTY, EMPTY, EMPTY];
  const mixedLine = convertLineToCurrentPuzzleType(mixedLine_String);
  const mixedLineSolution = [true, false, false, false, false];
  const mixedLineComplete = checkLineComplete(mixedLineSolution, mixedLine);
  expect(mixedLineComplete).toEqual(true);

  const fullLine_String = [FILLED, FILLED, FILLED, FILLED, FILLED];
  const fullLine = convertLineToCurrentPuzzleType(fullLine_String);
  const fullLineSolution = [true, true, true, true, true];
  const fullLineComplete = checkLineComplete(fullLineSolution, fullLine);
  expect(fullLineComplete).toEqual(true);

  const emptyLine_String = [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];
  const emptyLine = convertLineToCurrentPuzzleType(emptyLine_String);
  const emptyLineSolution = [false, false, false, false, false];
  const emptyLineComplete = checkLineComplete(emptyLineSolution, emptyLine);
  expect(emptyLineComplete).toEqual(true);

  const errorLine_String = [ERROR, ERROR, ERROR, ERROR, ERROR];
  const errorLine = convertLineToCurrentPuzzleType(errorLine_String);
  const errorLineSolution = [false, false, false, false, false];
  const errorLineComplete = checkLineComplete(errorLineSolution, errorLine);
  expect(errorLineComplete).toEqual(true);

  const incompleteLine_String = [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];
  const incompleteLine = convertLineToCurrentPuzzleType(incompleteLine_String);
  const incompleteLineSolution = [true, false, false, false, false];
  const incompleteLineComplete = checkLineComplete(incompleteLineSolution, incompleteLine);
  expect(incompleteLineComplete).toEqual(false);

  const markedLine_String = [MARKED, EMPTY, EMPTY, EMPTY, EMPTY];
  const markedLine = convertLineToCurrentPuzzleType(markedLine_String);
  const markedLineSolution = [true, false, false, false, false];
  const markedLineComplete = checkLineComplete(markedLineSolution, markedLine);
  expect(markedLineComplete).toEqual(false);
});

it('checks if a given currentPuzzle is complete by comparing it to the puzzleSolution', () => {
  const puzzle5x5Complete_String = [[FILLED, FILLED, FILLED, FILLED, FILLED],
  [EMPTY, FILLED, FILLED, EMPTY, EMPTY],
  [EMPTY, FILLED, EMPTY, FILLED, EMPTY],
  [EMPTY, FILLED, FILLED, EMPTY, EMPTY],
    [EMPTY, FILLED, FILLED, EMPTY, EMPTY]];
  const puzzle5x5Complete = convertPuzzleToCurrentPuzzleType(puzzle5x5Complete_String);
  const puzzle5x5CompleteResult = checkPuzzleComplete(puzzleSolution5x5, puzzle5x5Complete);
  expect(puzzle5x5CompleteResult).toEqual(true);

  const puzzle5x5CompleteWithError_String = [[FILLED, FILLED, FILLED, FILLED, FILLED],
  [ERROR, FILLED, FILLED, EMPTY, EMPTY],
  [EMPTY, FILLED, EMPTY, FILLED, EMPTY],
  [EMPTY, FILLED, FILLED, EMPTY, EMPTY],
  [EMPTY, FILLED, FILLED, EMPTY, EMPTY]];
  const puzzle5x5CompleteWithError = convertPuzzleToCurrentPuzzleType(puzzle5x5CompleteWithError_String);
  const puzzle5x5CompleteWithErrorResult = checkPuzzleComplete(puzzleSolution5x5, puzzle5x5CompleteWithError);
  expect(puzzle5x5CompleteWithErrorResult).toEqual(true);

  const incompletePuzzle5x5Row0Complete_String = [[FILLED, FILLED, FILLED, FILLED, FILLED],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]];
  const incompletePuzzle5x5Row0Complete = convertPuzzleToCurrentPuzzleType(incompletePuzzle5x5Row0Complete_String);
  const incompletePuzzle5x5Row0CompleteResult = checkPuzzleComplete(puzzleSolution5x5, incompletePuzzle5x5Row0Complete);
  expect(incompletePuzzle5x5Row0CompleteResult).toEqual(false);

  const incompletePuzzle5x5Column0Complete_String = [[FILLED, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]];
  const incompletePuzzle5x5Column0Complete = convertPuzzleToCurrentPuzzleType(incompletePuzzle5x5Column0Complete_String);
  const incompletePuzzle5x5Column0CompleteResult = checkPuzzleComplete(puzzleSolution5x5, incompletePuzzle5x5Column0Complete);
  expect(incompletePuzzle5x5Column0CompleteResult).toEqual(false);

  const incompletePuzzle5x5Marked_String = [[MARKED, MARKED, MARKED, MARKED, MARKED],
  [EMPTY, MARKED, MARKED, EMPTY, EMPTY],
  [EMPTY, MARKED, EMPTY, MARKED, EMPTY],
  [EMPTY, MARKED, MARKED, EMPTY, EMPTY],
  [EMPTY, MARKED, MARKED, EMPTY, EMPTY]];
  const incompletePuzzle5x5Marked = convertPuzzleToCurrentPuzzleType(incompletePuzzle5x5Marked_String);
  const incompletePuzzle5x5MarkedResult = checkPuzzleComplete(puzzleSolution5x5, incompletePuzzle5x5Marked);
  expect(incompletePuzzle5x5MarkedResult).toEqual(false);
});

it('checks if the game is lost', () => {
  expect(checkGameOver(0)).toEqual(true);
  expect(checkGameOver(1)).toEqual(false);
});

// Tile checks
it('checks if a given tile is fillable', () => {
  const emptyTile = { fill: EMPTY, selected: false };
  const filledTile = { fill: FILLED, selected: false };
  const errorTile = { fill: ERROR, selected: false };
  const markedTile = { fill: MARKED, selected: false };
  const completeTile = { fill: COMPLETE, selected: false };
  expect(checkTileFillable(emptyTile)).toEqual(true);

  expect(checkTileFillable(filledTile)).toEqual(false);
  expect(checkTileFillable(errorTile)).toEqual(false);
  expect(checkTileFillable(markedTile)).toEqual(false);
  expect(checkTileFillable(completeTile)).toEqual(false);
});

it('checks if a given tile is markable', () => {
  const emptyTile = { fill: EMPTY, selected: false };
  const filledTile = { fill: FILLED, selected: false };
  const errorTile = { fill: ERROR, selected: false };
  const markedTile = { fill: MARKED, selected: false };
  const completeTile = { fill: COMPLETE, selected: false };
  expect(checkTileMarkable(emptyTile)).toEqual(true);
  expect(checkTileMarkable(markedTile)).toEqual(true);

  expect(checkTileMarkable(filledTile)).toEqual(false);
  expect(checkTileMarkable(errorTile)).toEqual(false);
  expect(checkTileMarkable(completeTile)).toEqual(false);
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