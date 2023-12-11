import { FILL_STATE } from "constants/fillState";
import { convertStringLineToTileStateLine, convertStringMatrixToTileStateMatrix, convertTileStateLineToStringLine, convertTileStateMatrixToStringMatrix } from "functions/convertPuzzle";

const EMPTY = FILL_STATE.EMPTY;
const FILLED = FILL_STATE.FILLED;
const MARKED = FILL_STATE.MARKED;
const ERROR = FILL_STATE.ERROR;
const COMPLETE = 'complete';

const emptyTile = { fill: EMPTY, selected: false };
const filledTile = { fill: FILLED, selected: false };
const markedTile = { fill: MARKED, selected: false };
const errorTile = { fill: ERROR, selected: false };
const completeTile = { fill: COMPLETE, selected: false };

const stringLine = [EMPTY, FILLED, MARKED, ERROR, COMPLETE];
const tileStateLine = [emptyTile, filledTile, markedTile, errorTile, completeTile];

const stringMatrix = [[EMPTY, FILLED, MARKED, ERROR, COMPLETE],
[EMPTY, FILLED, MARKED, ERROR, COMPLETE],
[EMPTY, FILLED, MARKED, ERROR, COMPLETE],
[EMPTY, FILLED, MARKED, ERROR, COMPLETE],
[EMPTY, FILLED, MARKED, ERROR, COMPLETE]];

const tileStateMatrix = [[emptyTile, filledTile, markedTile, errorTile, completeTile],
[emptyTile, filledTile, markedTile, errorTile, completeTile],
[emptyTile, filledTile, markedTile, errorTile, completeTile],
[emptyTile, filledTile, markedTile, errorTile, completeTile],
[emptyTile, filledTile, markedTile, errorTile, completeTile]];

it('converts a string line to a TileState line', () => {
  const result = convertStringLineToTileStateLine(stringLine);
  expect(result).toEqual(tileStateLine);
});

it('converts a TileState line to a string line', () => {
  const result = convertTileStateLineToStringLine(tileStateLine);
  expect(result).toEqual(stringLine);
});

it('converts a string matrix to a TileState matrix', () => {
  const result = convertStringMatrixToTileStateMatrix(stringMatrix);
  expect(result).toEqual(tileStateMatrix);
});

it('converts a TileState matrix to a string matrix', () => {
  const result = convertTileStateMatrixToStringMatrix(tileStateMatrix);
  expect(result).toEqual(stringMatrix);
});