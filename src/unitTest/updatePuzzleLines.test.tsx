/* ---- Imports Section */
import React from 'react';
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fillState } from "constants/fillState";
// Functions
import { setTileColFillState } from 'functions/updatePuzzleLines';
import { setTileRowFillState } from 'functions/updatePuzzleLines';
/* End ---- */

const filled = fillState.filled;
const marked = fillState.marked;
const empty = fillState.empty;
const error = fillState.error;
const complete = 'complete';

const puzzle5x5 = [[empty, empty, empty, empty, empty],
[empty, empty, empty, empty, empty],
[empty, empty, empty, empty, empty],
[empty, empty, empty, empty, empty],
[empty, empty, empty, empty, empty]];

it(`sets a given lines' fillState to the specified state`, () => {
  // FILLED
  let expectedState = filled;
  setTileColFillState(puzzle5x5, 0, expectedState);
  setTileRowFillState(puzzle5x5, 0, expectedState);

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
  expectedState = marked;
  setTileColFillState(puzzle5x5, 0, expectedState);
  setTileRowFillState(puzzle5x5, 0, expectedState);

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
  expectedState = empty;
  setTileColFillState(puzzle5x5, 0, expectedState);
  setTileRowFillState(puzzle5x5, 0, expectedState);

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
  expectedState = error;
  setTileColFillState(puzzle5x5, 0, expectedState);
  setTileRowFillState(puzzle5x5, 0, expectedState);

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
  expectedState = complete;
  setTileColFillState(puzzle5x5, 0, expectedState);
  setTileRowFillState(puzzle5x5, 0, expectedState);

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