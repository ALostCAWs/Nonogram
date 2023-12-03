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

const puzzleSolution5x5 = [[true, true, true, true, true],
[false, true, false, false, false],
[false, true, false, true, false],
[true, true, true, false, false],
[false, false, false, false, false]];

it('ends the game when lives run out', async () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const tile_error_1 = screen.getByTestId(`tile1-0`);
  const tile_error_2 = screen.getByTestId(`tile1-2`);
  const tile_error_3 = screen.getByTestId(`tile1-3`);

  await userEvent.click(tile_error_1);
  await userEvent.click(tile_error_2);
  await userEvent.click(tile_error_3);

  // All lives removed
  expect(screen.queryByTestId('life')).toBeNull();

  // GameOver component loaded
  // Testing if a child component rendered seems to be discouraged, instead test for a piece of it
  // Retry button loaded
  expect(screen.getAllByRole('button', { name: 'Retry' })).not.toBeNull();
});

it('prevents tile onClick when the game ends', async () => {
  // Tests only fillMode true case
  // Game will never end with fillMode false
  // Game end while fillMode is false is impossible
  // Cannot switch fill modes after game end
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const tile_fill_1 = screen.getByTestId(`tile0-0`);
  const tile_error_1 = screen.getByTestId(`tile1-0`);
  const tile_error_2 = screen.getByTestId(`tile1-2`);
  const tile_error_3 = screen.getByTestId(`tile1-3`);

  // Cause end screen to load
  await userEvent.click(tile_error_1);
  await userEvent.click(tile_error_2);
  await userEvent.click(tile_error_3);

  // Tiles unclickable
  await userEvent.click(tile_fill_1);
  expect(tile_fill_1).not.toHaveClass(filled, marked, error, complete);
});

it('prevents tile onHover when the game ends', async () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const tile_fill_1 = screen.getByTestId(`tile0-0`);
  const tile_fill_2 = screen.getByTestId(`tile3-2`);
  const tile_error_1 = screen.getByTestId(`tile1-0`);
  const tile_error_2 = screen.getByTestId(`tile1-2`);
  const tile_error_3 = screen.getByTestId(`tile1-3`);

  const rowInfo = screen.getByTestId(`rowInfo3`);
  const colInfo = screen.getByTestId(`colInfo2`);
  // Cause end screen to load
  // Hover/unhover each click to most accurately simulate user interactions
  await userEvent.hover(tile_fill_1);
  await userEvent.click(tile_fill_1);
  await userEvent.unhover(tile_fill_1);

  await userEvent.hover(tile_error_1);
  await userEvent.click(tile_error_1);
  await userEvent.unhover(tile_error_1);

  await userEvent.hover(tile_error_2);
  await userEvent.click(tile_error_2);
  await userEvent.unhover(tile_error_2);

  await userEvent.hover(tile_error_3);
  await userEvent.click(tile_error_3);
  await userEvent.unhover(tile_error_3);

  // BEFORE the retry button is click, test . . .
  // Tiles unhoverable ( remove the hover CSS as well as the onHover function / event being passed to them )
  await userEvent.hover(tile_fill_2);
  expect(rowInfo).not.toHaveClass('hoverInfo');
  expect(colInfo).not.toHaveClass('hoverInfo');
});

it('prevents fillMode buttons onClick when the game ends', async () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const tile_error_1 = screen.getByTestId(`tile1-0`);
  const tile_error_2 = screen.getByTestId(`tile1-2`);
  const tile_error_3 = screen.getByTestId(`tile1-3`);

  // Cause end screen to load
  await userEvent.click(tile_error_1);
  await userEvent.click(tile_error_2);
  await userEvent.click(tile_error_3);

  // Fill mode buttons unclickable
  await userEvent.click(screen.getByRole('button', { name: 'Mark' }));
  expect(screen.getByRole('button', { name: 'Mark' })).toBeEnabled();
});

it('resets the game when the retry button is clicked', async () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const tile_fill_1 = screen.getByTestId(`tile0-0`);
  const tile_mark_1 = screen.getByTestId(`tile0-1`);
  const tile_error_1 = screen.getByTestId(`tile1-0`);
  const tile_error_2 = screen.getByTestId(`tile1-2`);
  const tile_error_3 = screen.getByTestId(`tile1-3`);

  // Fill tile
  await userEvent.click(tile_fill_1);

  // Mark tile
  await userEvent.click(screen.getByRole('button', { name: 'Mark' }));
  await userEvent.click(tile_mark_1);
  await userEvent.click(screen.getByRole('button', { name: 'Fill' }));

  // Cause end screen to load
  await userEvent.click(tile_error_1);
  await userEvent.click(tile_error_2);
  await userEvent.click(tile_error_3);

  // GameOver component loaded
  // Click reset button
  await userEvent.click(screen.getByRole('button', { name: 'Retry' }));

  // Test
  // GameOver component gone
  expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull();

  // Lives are back on the screen (tests for at least 1 & the correct amount, 3)
  expect(screen.getAllByTestId('life').length).toBeGreaterThan(0);
  expect(screen.getAllByTestId('life').length).toEqual(3);

  // Clicked are now all empty
  expect(tile_fill_1).not.toHaveClass(filled, marked, error, complete);

  // Error row is set to error correctly
  expect(screen.getByTestId(`tile4-0`)).toHaveClass(error);
  expect(screen.getByTestId(`tile4-1`)).toHaveClass(error);
  expect(screen.getByTestId(`tile4-2`)).toHaveClass(error);
  expect(screen.getByTestId(`tile4-3`)).toHaveClass(error);
  expect(screen.getByTestId(`tile4-4`)).toHaveClass(error);
});