/* ---- Imports Section */
import React from 'react';
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fillState } from "constants/fillState";
// Components
import { PlayNonogramProvider } from 'components/providers/playNonogramProvider';
/* End ---- */

const filled = fillState.filled;
const marked = fillState.marked;
const error = fillState.error;
const complete = 'complete';

const puzzleSolution5x5 = [[true, false, false, false, false],
[false, true, false, false, false],
[false, true, false, false, false],
[false, false, false, false, false],
[false, false, false, false, false]];

it('completes the game when the puzzle is solved', () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const tile_error_1 = screen.getByTestId('tile0-1');
  const tile_error_2 = screen.getByTestId('tile0-2');

  const tile_fill_1 = screen.getByTestId('tile0-0');
  const tile_fill_2 = screen.getByTestId('tile1-1');
  const tile_fill_3 = screen.getByTestId('tile2-1');

  userEvent.click(tile_error_1);
  userEvent.click(tile_error_2);

  userEvent.click(tile_fill_1);
  userEvent.click(tile_fill_2);
  userEvent.click(tile_fill_3);

  // GameComplete component loaded
  expect(screen.getAllByText('Puzzle solved with 2 lives remaining')).not.toBeNull();
});

it('prevents tile onClick when the puzzle is solved', () => {
  // Tests only fillMode true case
  // Game will never complete with fillMode false
  // Game complete while fillMode is false is impossible
  // Cannot switch fill modes after game complete
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const tile_error_1 = screen.getByTestId('tile0-1');

  const tile_fill_1 = screen.getByTestId('tile0-0');
  const tile_fill_2 = screen.getByTestId('tile1-1');
  const tile_fill_3 = screen.getByTestId('tile2-1');

  // Cause complete screen to load
  userEvent.click(tile_fill_1);
  userEvent.click(tile_fill_2);
  userEvent.click(tile_fill_3);

  // Tiles unclickable
  userEvent.click(tile_error_1);
  expect(tile_error_1).not.toHaveClass(filled, marked, error, complete);
});

it('prevents tile onHover when the puzzle is solved', () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const tile_error_1 = screen.getByTestId('tile0-1');

  const tile_fill_1 = screen.getByTestId('tile0-0');
  const tile_fill_2 = screen.getByTestId('tile1-1');
  const tile_fill_3 = screen.getByTestId('tile2-1');

  const rowHint = screen.getByTestId('rowHint3');
  const colHint = screen.getByTestId('colHint2');

  // Cause complete screen to load
  // Hover/unhover each click to most accurately simulate user interactions
  userEvent.hover(tile_error_1);
  userEvent.click(tile_error_1);
  userEvent.unhover(tile_error_1);

  userEvent.hover(tile_fill_1);
  userEvent.click(tile_fill_1);
  userEvent.unhover(tile_fill_1);

  userEvent.hover(tile_fill_2);
  userEvent.click(tile_fill_2);
  userEvent.unhover(tile_fill_2);

  userEvent.hover(tile_fill_3);
  userEvent.click(tile_fill_3);
  userEvent.unhover(tile_fill_3);

  // BEFORE the retry button is click, test . . .
  // Tiles unhoverable ( remove the hover CSS as well as the onHover function / event being passed to them )
  userEvent.hover(tile_fill_1);
  expect(rowHint).not.toHaveClass('hoverHint');
  expect(colHint).not.toHaveClass('hoverHint');
});

it('prevents fillMode buttons onClick when the puzzle is solved', () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const tile_fill_1 = screen.getByTestId('tile0-0');
  const tile_fill_2 = screen.getByTestId('tile1-1');
  const tile_fill_3 = screen.getByTestId('tile2-1');

  // Cause complete screen to load
  userEvent.click(tile_fill_1);
  userEvent.click(tile_fill_2);
  userEvent.click(tile_fill_3);

  // Fill mode buttons unclickable
  userEvent.click(screen.getByRole('button', { name: 'Mark' }));
  expect(screen.getByRole('button', { name: 'Mark' })).toBeEnabled();
});

it('resets the game when the retry button is clicked', () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const tile_error_1 = screen.getByTestId('tile0-1');
  const tile_mark_1 = screen.getByTestId('tile0-2');

  const tile_fill_1 = screen.getByTestId('tile0-0');
  const tile_fill_2 = screen.getByTestId('tile1-1');
  const tile_fill_3 = screen.getByTestId('tile2-1');

  // Error tile
  userEvent.click(tile_error_1);

  // Fill tile
  userEvent.click(tile_fill_1);

  // Mark tile
  userEvent.click(screen.getByRole('button', { name: 'Mark' }));
  userEvent.click(tile_mark_1);
  userEvent.click(screen.getByRole('button', { name: 'Fill' }));

  // Cause complete screen to load
  userEvent.click(tile_fill_2);
  userEvent.click(tile_fill_3);

  // GameComplete component loaded
  // Click reset button
  userEvent.click(screen.getByRole('button', { name: 'Retry' }));

  // Test
  // GameComplete component gone
  expect(screen.queryByText('Puzzle solved with 2 lives remaining')).toBeNull();

  // Lives are back on the screen (tests for at least 1 & the correct amount, 3)
  expect(screen.getAllByTestId('life').length).toBeGreaterThan(0);
  expect(screen.getAllByTestId('life').length).toEqual(3);

  // Clicked are now all empty
  expect(tile_error_1).not.toHaveClass(filled, marked, error, complete);
  expect(tile_mark_1).not.toHaveClass(filled, marked, error, complete);

  expect(tile_fill_1).not.toHaveClass(filled, marked, error, complete);
  expect(tile_fill_2).not.toHaveClass(filled, marked, error, complete);
  expect(tile_fill_3).not.toHaveClass(filled, marked, error, complete);

  // Error row is set to error correctly
  expect(screen.getByTestId(`tile4-0`)).toHaveClass(error);
  expect(screen.getByTestId(`tile4-1`)).toHaveClass(error);
  expect(screen.getByTestId(`tile4-2`)).toHaveClass(error);
  expect(screen.getByTestId(`tile4-3`)).toHaveClass(error);
  expect(screen.getByTestId(`tile4-4`)).toHaveClass(error);
});