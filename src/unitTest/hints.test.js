/* ---- Imports Section */
import React from 'react';
import { getByTestId, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fillState } from "../nonogram/state.js";
// Components
import { NonogramProvider } from '../nonogram/playGame/nonogramProvider.js';
import { Hints } from '../nonogram/boardDisplay/hints.js';
// Functions
import { getGameByColumn } from '../nonogram/boardDisplay/getBoardInfo.js';
/* End ---- */

const filled = fillState.filled;
const marked = fillState.marked;
const error = fillState.error;
const complete = 'complete';
const empty = fillState.empty

const gameSolution5x5_RowTest = [[true, true, true, true, true],
[false, true, false, false, false],
[false, true, false, true, false],
[true, true, true, false, true],
[false, false, false, false, false]];

const currentGame5x5_RowTest = [[empty, empty, empty, empty, empty],
[empty, filled, empty, empty, empty],
[empty, filled, empty, filled, empty],
[empty, empty, empty, empty, empty],
[error, error, error, error, error]];

let gameSolution5x5_ColTest = [[true, true, true, true, false],
[true, true, false, false, false],
[true, true, false, true, false],
[true, true, true, false, false],
[true, false, false, false, false]];
gameSolution5x5_ColTest = getGameByColumn(gameSolution5x5_ColTest);

let currentGame5x5_ColTest = [[empty, empty, empty, empty, error],
[empty, filled, empty, empty, error],
[empty, filled, empty, filled, error],
[empty, empty, empty, empty, error],
[empty, empty, empty, empty, error]];
currentGame5x5_ColTest = getGameByColumn(currentGame5x5_ColTest);

// 0 hints are red
// Full hints are highlighted
// Complete hints are greyed
// Correct associated hint is greyed

/* ---- Initialization Tests */
it('initializes a standard hint as black', () => {
  let index = 1;
  render(<Hints lineGameSolution={gameSolution5x5_RowTest[index]} currentLineGame={currentGame5x5_RowTest[index]} lineIndex={index} maxHintCount={3} lineType={'row'} />);

  expect(screen.getByTestId(`hint${index} - 0`)).not.toHaveClass('zeroHint');
  expect(screen.getByTestId(`hint${index} - 0`)).toHaveTextContent('1');
});

it('initializes multiple standard hints as black', () => {
  let index = 3;
  render(<Hints lineGameSolution={gameSolution5x5_RowTest[index]} currentLineGame={currentGame5x5_RowTest[index]} lineIndex={index} maxHintCount={3} lineType={'row'} />);

  expect(screen.getByTestId(`hint${index} - 0`)).toHaveTextContent('3');
  expect(screen.getByTestId(`hint${index} - 0`)).not.toHaveClass('zeroHint');
  expect(screen.getByTestId(`hint${index} - 1`)).toHaveTextContent('1');
  expect(screen.getByTestId(`hint${index} - 1`)).not.toHaveClass('zeroHint');
});

it('initializes empty column hints as 0', () => {
  let index = 4;
  render(<Hints lineGameSolution={gameSolution5x5_ColTest[index]} currentLineGame={currentGame5x5_ColTest[index]} lineIndex={index} maxHintCount={3} lineType={'col'} />);

  expect(screen.getByTestId(`hint${index} - 0`)).toHaveClass('zeroHint');
  expect(screen.getByTestId(`hint${index} - 0`)).toHaveTextContent('0');
});

it('initializes empty row hints as 0', () => {
  let index = 4;
  render(<Hints lineGameSolution={gameSolution5x5_RowTest[index]} currentLineGame={currentGame5x5_RowTest[index]} lineIndex={index} maxHintCount={3} lineType={'row'} />);

  expect(screen.getByTestId(`hint${index} - 0`)).toHaveClass('zeroHint');
  expect(screen.getByTestId(`hint${index} - 0`)).toHaveTextContent('0');
});

// complete col & row hints as yellow

/* ---- Responding to changes tests */
// Hint greys when it's associated tiles are filled
// None, one, all
// Col & row