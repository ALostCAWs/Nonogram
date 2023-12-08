import { FILL_STATE } from "constants/fillState";
import { setTileRowFillState } from 'functions/updatePuzzleLines';
import { setTileColFillState } from 'functions/updatePuzzleLines';

const FILLED = FILL_STATE.FILLED;
const MARKED = FILL_STATE.MARKED;
const EMPTY = FILL_STATE.EMPTY;
const ERROR = FILL_STATE.ERROR;
const COMPLETE = 'complete';

let puzzle5x5 = [[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]];

it(`sets a given lines' FILL_STATE to the specified state`, () => {
  // FILLED
  let expectedState = FILLED;
  puzzle5x5 = setTileColFillState(puzzle5x5, 0, expectedState);
  puzzle5x5 = setTileRowFillState(puzzle5x5, 0, expectedState);

  // Corner
  expect(puzzle5x5[0][0]).toEqual(expectedState);
  // Column
  expect(puzzle5x5[1][0]).toEqual(expectedState);
  expect(puzzle5x5[2][0]).toEqual(expectedState);
  expect(puzzle5x5[3][0]).toEqual(expectedState);
  expect(puzzle5x5[4][0]).toEqual(expectedState);
  // Row
  expect(puzzle5x5[0][1]).toEqual(expectedState);
  expect(puzzle5x5[0][2]).toEqual(expectedState);
  expect(puzzle5x5[0][3]).toEqual(expectedState);
  expect(puzzle5x5[0][4]).toEqual(expectedState);

  // MARKED
  expectedState = MARKED;
  puzzle5x5 = setTileColFillState(puzzle5x5, 0, expectedState);
  puzzle5x5 = setTileRowFillState(puzzle5x5, 0, expectedState);

  // Corner
  expect(puzzle5x5[0][0]).toEqual(expectedState);
  // Column
  expect(puzzle5x5[1][0]).toEqual(expectedState);
  expect(puzzle5x5[2][0]).toEqual(expectedState);
  expect(puzzle5x5[3][0]).toEqual(expectedState);
  expect(puzzle5x5[4][0]).toEqual(expectedState);
  // Row
  expect(puzzle5x5[0][1]).toEqual(expectedState);
  expect(puzzle5x5[0][2]).toEqual(expectedState);
  expect(puzzle5x5[0][3]).toEqual(expectedState);
  expect(puzzle5x5[0][4]).toEqual(expectedState);

  // EMPTY
  expectedState = EMPTY;
  puzzle5x5 = setTileColFillState(puzzle5x5, 0, expectedState);
  puzzle5x5 = setTileRowFillState(puzzle5x5, 0, expectedState);

  // Corner
  expect(puzzle5x5[0][0]).toEqual(expectedState);
  // Column
  expect(puzzle5x5[1][0]).toEqual(expectedState);
  expect(puzzle5x5[2][0]).toEqual(expectedState);
  expect(puzzle5x5[3][0]).toEqual(expectedState);
  expect(puzzle5x5[4][0]).toEqual(expectedState);
  // Row
  expect(puzzle5x5[0][1]).toEqual(expectedState);
  expect(puzzle5x5[0][2]).toEqual(expectedState);
  expect(puzzle5x5[0][3]).toEqual(expectedState);
  expect(puzzle5x5[0][4]).toEqual(expectedState);

  // ERROR
  expectedState = ERROR;
  puzzle5x5 = setTileColFillState(puzzle5x5, 0, expectedState);
  puzzle5x5 = setTileRowFillState(puzzle5x5, 0, expectedState);

  // Corner
  expect(puzzle5x5[0][0]).toEqual(expectedState);
  // Column
  expect(puzzle5x5[1][0]).toEqual(expectedState);
  expect(puzzle5x5[2][0]).toEqual(expectedState);
  expect(puzzle5x5[3][0]).toEqual(expectedState);
  expect(puzzle5x5[4][0]).toEqual(expectedState);
  // Row
  expect(puzzle5x5[0][1]).toEqual(expectedState);
  expect(puzzle5x5[0][2]).toEqual(expectedState);
  expect(puzzle5x5[0][3]).toEqual(expectedState);
  expect(puzzle5x5[0][4]).toEqual(expectedState);

  // COMPLETE
  expectedState = COMPLETE;
  puzzle5x5 = setTileColFillState(puzzle5x5, 0, expectedState);
  puzzle5x5 = setTileRowFillState(puzzle5x5, 0, expectedState);

  // Corner
  expect(puzzle5x5[0][0]).toEqual(expectedState);
  // Column
  expect(puzzle5x5[1][0]).toEqual(expectedState);
  expect(puzzle5x5[2][0]).toEqual(expectedState);
  expect(puzzle5x5[3][0]).toEqual(expectedState);
  expect(puzzle5x5[4][0]).toEqual(expectedState);
  // Row
  expect(puzzle5x5[0][1]).toEqual(expectedState);
  expect(puzzle5x5[0][2]).toEqual(expectedState);
  expect(puzzle5x5[0][3]).toEqual(expectedState);
  expect(puzzle5x5[0][4]).toEqual(expectedState);
});