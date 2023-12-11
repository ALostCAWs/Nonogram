import { FILL_STATE } from "constants/fillState";
import { convertStringMatrixToTileStateMatrix } from "functions/convertPuzzle";
import { setTileRowFillState } from 'functions/updatePuzzleLines';
import { setTileColFillState } from 'functions/updatePuzzleLines';

const FILLED = FILL_STATE.FILLED;
const MARKED = FILL_STATE.MARKED;
const EMPTY = FILL_STATE.EMPTY;
const ERROR = FILL_STATE.ERROR;
const COMPLETE = 'complete';

const puzzle5x5_String = [[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]];

let puzzle5x5 = convertStringMatrixToTileStateMatrix(puzzle5x5_String);

it(`sets a given lines' FILL_STATE to the specified state`, () => {
  // FILLED
  let expectedState = FILLED;
  puzzle5x5 = setTileColFillState(puzzle5x5, 0, expectedState);
  puzzle5x5 = setTileRowFillState(puzzle5x5, 0, expectedState);

  // Corner
  expect(puzzle5x5[0][0].fill).toEqual(expectedState);
  // Column
  expect(puzzle5x5[1][0].fill).toEqual(expectedState);
  expect(puzzle5x5[2][0].fill).toEqual(expectedState);
  expect(puzzle5x5[3][0].fill).toEqual(expectedState);
  expect(puzzle5x5[4][0].fill).toEqual(expectedState);
  // Row
  expect(puzzle5x5[0][1].fill).toEqual(expectedState);
  expect(puzzle5x5[0][2].fill).toEqual(expectedState);
  expect(puzzle5x5[0][3].fill).toEqual(expectedState);
  expect(puzzle5x5[0][4].fill).toEqual(expectedState);

  // MARKED
  expectedState = MARKED;
  puzzle5x5 = setTileColFillState(puzzle5x5, 0, expectedState);
  puzzle5x5 = setTileRowFillState(puzzle5x5, 0, expectedState);

  // Corner
  expect(puzzle5x5[0][0].fill).toEqual(expectedState);
  // Column
  expect(puzzle5x5[1][0].fill).toEqual(expectedState);
  expect(puzzle5x5[2][0].fill).toEqual(expectedState);
  expect(puzzle5x5[3][0].fill).toEqual(expectedState);
  expect(puzzle5x5[4][0].fill).toEqual(expectedState);
  // Row
  expect(puzzle5x5[0][1].fill).toEqual(expectedState);
  expect(puzzle5x5[0][2].fill).toEqual(expectedState);
  expect(puzzle5x5[0][3].fill).toEqual(expectedState);
  expect(puzzle5x5[0][4].fill).toEqual(expectedState);

  // EMPTY
  expectedState = EMPTY;
  puzzle5x5 = setTileColFillState(puzzle5x5, 0, expectedState);
  puzzle5x5 = setTileRowFillState(puzzle5x5, 0, expectedState);

  // Corner
  expect(puzzle5x5[0][0].fill).toEqual(expectedState);
  // Column
  expect(puzzle5x5[1][0].fill).toEqual(expectedState);
  expect(puzzle5x5[2][0].fill).toEqual(expectedState);
  expect(puzzle5x5[3][0].fill).toEqual(expectedState);
  expect(puzzle5x5[4][0].fill).toEqual(expectedState);
  // Row
  expect(puzzle5x5[0][1].fill).toEqual(expectedState);
  expect(puzzle5x5[0][2].fill).toEqual(expectedState);
  expect(puzzle5x5[0][3].fill).toEqual(expectedState);
  expect(puzzle5x5[0][4].fill).toEqual(expectedState);

  // ERROR
  expectedState = ERROR;
  puzzle5x5 = setTileColFillState(puzzle5x5, 0, expectedState);
  puzzle5x5 = setTileRowFillState(puzzle5x5, 0, expectedState);

  // Corner
  expect(puzzle5x5[0][0].fill).toEqual(expectedState);
  // Column
  expect(puzzle5x5[1][0].fill).toEqual(expectedState);
  expect(puzzle5x5[2][0].fill).toEqual(expectedState);
  expect(puzzle5x5[3][0].fill).toEqual(expectedState);
  expect(puzzle5x5[4][0].fill).toEqual(expectedState);
  // Row
  expect(puzzle5x5[0][1].fill).toEqual(expectedState);
  expect(puzzle5x5[0][2].fill).toEqual(expectedState);
  expect(puzzle5x5[0][3].fill).toEqual(expectedState);
  expect(puzzle5x5[0][4].fill).toEqual(expectedState);

  // COMPLETE
  expectedState = COMPLETE;
  puzzle5x5 = setTileColFillState(puzzle5x5, 0, expectedState);
  puzzle5x5 = setTileRowFillState(puzzle5x5, 0, expectedState);

  // Corner
  expect(puzzle5x5[0][0].fill).toEqual(expectedState);
  // Column
  expect(puzzle5x5[1][0].fill).toEqual(expectedState);
  expect(puzzle5x5[2][0].fill).toEqual(expectedState);
  expect(puzzle5x5[3][0].fill).toEqual(expectedState);
  expect(puzzle5x5[4][0].fill).toEqual(expectedState);
  // Row
  expect(puzzle5x5[0][1].fill).toEqual(expectedState);
  expect(puzzle5x5[0][2].fill).toEqual(expectedState);
  expect(puzzle5x5[0][3].fill).toEqual(expectedState);
  expect(puzzle5x5[0][4].fill).toEqual(expectedState);
});