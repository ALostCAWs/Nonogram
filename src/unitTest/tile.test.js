/* ---- Imports Section */
import React from 'react';
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fillState } from "../nonogram/state.js";
// Components
import { NonogramProvider } from '../nonogram/playGame/nonogramProvider.js';
/* End ---- */

const filled = fillState.filled;
const marked = fillState.marked;
const empty = fillState.empty;
const error = fillState.error;

const gameSolution5x5 = [[true, true, true, true, true],
[false, true, true, false, false],
[false, true, false, true, false],
[false, true, true, false, false],
[false, true, true, false, false]];

it('highlights the associated hints on hover', async () => {
  const rowIndex = 0;
  const colIndex = 0;

  render(<NonogramProvider gameSolution={gameSolution5x5} />);

  const tile = screen.getByTestId(`tile${rowIndex}-${colIndex}`);
  const rowHint = screen.getByTestId(`rowHint${rowIndex}`);
  const colHint = screen.getByTestId(`colHint${colIndex}`);

  // mouseenter
  userEvent.hover(tile);
  expect(rowHint).toHaveClass('hoverHint');
  expect(colHint).toHaveClass('hoverHint');

  // mouseleave
  userEvent.unhover(tile);
  expect(rowHint).not.toHaveClass('hoverHint');
  expect(colHint).not.toHaveClass('hoverHint');
});

it('sets tile to correct fillState on click', async () => {
  // fillState = true
  // filled
  // error
  // marked complete

  // fillState = false
  // marked
  // empty
});