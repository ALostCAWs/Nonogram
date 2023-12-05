/* ---- Imports Section */
import React from 'react';
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fillState } from "constants/fillState";
// Components
import { PlayNonogramProvider } from 'components/providers/playNonogramProvider';
import { GameModeContext } from 'contexts/gameModeContext';
import { gameModeState } from 'constants/gameModeState';
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

/* FILLMODE */
it('sets the fillMode to true on component initialization', () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const fillButton = screen.getByRole('button', { name: 'Fill' });
  const markButton = screen.getByRole('button', { name: 'Mark' });

  expect(fillButton).toBeDisabled();
  expect(markButton).toBeEnabled();
});

it('toggles the fillMode on click', async () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const fillButton = screen.getByRole('button', { name: 'Fill' });
  const markButton = screen.getByRole('button', { name: 'Mark' });

  await userEvent.click(markButton);

  expect(fillButton).toBeEnabled();
  expect(markButton).toBeDisabled();
});

/* TILES */
// Initialization Tests
it('initializes the tiles with fillState.empty', () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  // true tile
  const tile_true = screen.getByTestId(`tile0-0`);
  expect(tile_true).not.toHaveClass(filled, marked, error, complete);

  // false tile
  const tile_false = screen.getByTestId(`tile1-0`);
  expect(tile_false).not.toHaveClass(filled, marked, error, complete);
});

it('initializes the tiles in false-only columns with fillState.error', () => {
  const puzzleSolution5x5_FalseCol = [[true, true, true, true, false],
  [false, true, false, false, false],
  [false, true, false, true, false],
  [true, true, true, false, false],
  [false, false, false, false, false]];
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5_FalseCol} />);

  expect(screen.getByTestId(`tile0-4`)).toHaveClass(error);
  expect(screen.getByTestId(`tile1-4`)).toHaveClass(error);
  expect(screen.getByTestId(`tile2-4`)).toHaveClass(error);
  expect(screen.getByTestId(`tile3-4`)).toHaveClass(error);
  expect(screen.getByTestId(`tile4-4`)).toHaveClass(error);
});

it('initializes the tiles in false-only rows with fillState.error', () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);

  expect(screen.getByTestId(`tile4-0`)).toHaveClass(error);
  expect(screen.getByTestId(`tile4-1`)).toHaveClass(error);
  expect(screen.getByTestId(`tile4-2`)).toHaveClass(error);
  expect(screen.getByTestId(`tile4-3`)).toHaveClass(error);
  expect(screen.getByTestId(`tile4-4`)).toHaveClass(error);
});

it('highlights the associated info tiles on hover', async () => {
  const rowIndex = 0;
  const colIndex = 0;

  render(
    <GameModeContext.Provider value={gameModeState.play} >
      <PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />
    </GameModeContext.Provider>
  );

  const tile = screen.getByTestId(`tile${rowIndex}-${colIndex}`);
  const rowInfo = screen.getByTestId(`rowInfo${rowIndex}`);
  const colInfo = screen.getByTestId(`colInfo${colIndex}`);

  // mouseenter
  await userEvent.hover(tile);
  expect(rowInfo).toHaveClass('hoverInfo');
  expect(colInfo).toHaveClass('hoverInfo');

  // mouseleave
  await userEvent.unhover(tile);
  expect(rowInfo).not.toHaveClass('hoverInfo');
  expect(colInfo).not.toHaveClass('hoverInfo');
});

// Fill / Error / Mark - Basic functionality tests
it('fills tiles that are true according to the puzzleSolution array', async () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const tile = screen.getByTestId(`tile0-0`)
  await userEvent.click(tile);
  expect(tile).toHaveClass(filled);
});

it('errors tiles that are true according to the puzzleSolution array', async () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const tile = screen.getByTestId(`tile1-0`);
  await userEvent.click(tile);
  expect(tile).toHaveClass(error);
});

it('marks empty tiles regardless of puzzleSolution array', async () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  await userEvent.click(screen.getByRole('button', { name: 'Mark' }));
  const tile_true = screen.getByTestId(`tile0-0`);
  const tile_false = screen.getByTestId(`tile1-0`);

  // Mark
  await userEvent.click(tile_true);
  expect(tile_true).toHaveClass(marked);
  await userEvent.click(tile_false);
  expect(tile_false).toHaveClass(marked);

  // Unmark
  await userEvent.click(tile_true);
  expect(tile_true).not.toHaveClass(marked);
  await userEvent.click(tile_false);
  expect(tile_false).not.toHaveClass(marked);
});

it('completes all remaining empty tiles in a column when complete', async () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const tile_fill = screen.getByTestId(`tile0-4`);
  const tile_mark = screen.getByTestId(`tile1-4`);
  const tile_completeMark_1 = screen.getByTestId(`tile2-4`);
  const tile_completeMark_2 = screen.getByTestId(`tile3-4`);

  // Mark tile manually, then fill to complete line
  await userEvent.click(screen.getByRole('button', { name: 'Mark' }));
  await userEvent.click(tile_mark);
  await userEvent.click(screen.getByRole('button', { name: 'Fill' }));
  await userEvent.click(tile_fill);

  // All non-error'd false tiles should now have complete class, even if they were already manually marked
  expect(tile_mark).toHaveClass(complete);
  expect(tile_completeMark_1).toHaveClass(complete);
  expect(tile_completeMark_2).toHaveClass(complete);
});

it('completes all remaining empty tiles in a row when complete', async () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const tile_mark = screen.getByTestId(`tile1-0`);
  const tile_fill = screen.getByTestId(`tile1-1`);
  const tile_completeMark_1 = screen.getByTestId(`tile1-2`);
  const tile_completeMark_2 = screen.getByTestId(`tile1-3`);
  const tile_completeMark_3 = screen.getByTestId(`tile1-4`);

  // Mark tile manually, then fill to complete line
  await userEvent.click(screen.getByRole('button', { name: 'Mark' }));
  await userEvent.click(tile_mark);
  await userEvent.click(screen.getByRole('button', { name: 'Fill' }));
  await userEvent.click(tile_fill);

  // All non-error'd false tiles should now have complete class, even if they were already manually marked
  await waitFor(() => {
    expect(tile_mark).toHaveClass(complete);
    expect(tile_completeMark_1).toHaveClass(complete);
    expect(tile_completeMark_2).toHaveClass(complete);
    expect(tile_completeMark_3).toHaveClass(complete);
  });
});

// Fill / Error / Mark - Preventative functionality tests
it('prevents filled tiles from being unfilled or marked', async () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const tile = screen.getByTestId(`tile0-0`)
  await userEvent.click(tile);
  expect(tile).toHaveClass(filled);

  // Retain filled class after additional fillMode true click
  await userEvent.click(tile);
  expect(tile).toHaveClass(filled);

  // Retain filled class after mark attempt with fillMode false click
  await userEvent.click(screen.getByRole('button', { name: 'Mark' }));
  await userEvent.click(tile);
  expect(tile).toHaveClass(filled);
  expect(tile).not.toHaveClass(marked);
});

it(`prevents error'd tiles from being unerror'd or marked`, async () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const tile = screen.getByTestId(`tile1-0`)
  await userEvent.click(tile);
  expect(tile).toHaveClass(error);

  // Retain error class after additional fillMode true click
  await userEvent.click(tile);
  expect(tile).toHaveClass(error);

  // Retain error class after mark attempt with fillMode false click
  await userEvent.click(screen.getByRole('button', { name: 'Mark' }));
  await userEvent.click(tile);
  expect(tile).toHaveClass(error);
  expect(tile).not.toHaveClass(marked);
});

it(`prevents marked tiles from being filled / error'd`, async () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  await userEvent.click(screen.getByRole('button', { name: 'Mark' }));
  const tile_mark = screen.getByTestId(`tile0-0`);

  await userEvent.click(tile_mark);
  await userEvent.click(screen.getByRole('button', { name: 'Fill' }));
  await userEvent.click(tile_mark);
  expect(tile_mark).toHaveClass(marked);
  expect(tile_mark).not.toHaveClass(filled, error);
});

it(`prevents marked complete tiles from being filled, error'd or unmarked`, async () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const tile_fill_1 = screen.getByTestId(`tile0-0`);
  const tile_fill_2 = screen.getByTestId(`tile3-0`);
  const tile_completeMark_1 = screen.getByTestId(`tile1-0`);
  const tile_completeMark_2 = screen.getByTestId(`tile2-0`);

  // Complete line
  await userEvent.click(tile_fill_1);
  await userEvent.click(tile_fill_2);

  // Attempt error of marked complete tiles
  await userEvent.click(tile_completeMark_1);
  expect(tile_completeMark_1).toHaveClass(complete);
  expect(tile_completeMark_1).not.toHaveClass(filled, error);

  await userEvent.click(tile_completeMark_2);
  expect(tile_completeMark_2).toHaveClass(complete);
  expect(tile_completeMark_2).not.toHaveClass(filled, error);

  // Attempt mark / unmark of complete tiles
  await userEvent.click(screen.getByRole('button', { name: 'Mark' }));
  await userEvent.click(tile_completeMark_1);
  expect(tile_completeMark_1).toHaveClass(complete);
  expect(tile_completeMark_1).not.toHaveClass(filled, error);

  await userEvent.click(tile_completeMark_2);
  expect(tile_completeMark_2).toHaveClass(complete);
  expect(tile_completeMark_2).not.toHaveClass(filled, error);
});

/* LIVES */
it('initializes with the at least one life', () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  expect(screen.getAllByTestId('life').length).toBeGreaterThan(0);
});

it('initializes with the correct number of lives based on the board dimensions', () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  expect(screen.getAllByTestId('life').length).toEqual(3);
});

it('reduces the lives count by one when an error is made', async () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const lifeCount_preClick = screen.getAllByTestId('life').length;
  const tile_error = screen.getByTestId(`tile1-0`);

  await userEvent.click(tile_error);
  const lifeCount_postClick = screen.getAllByTestId('life').length;

  expect(lifeCount_preClick - lifeCount_postClick).toEqual(1);
});

it('only reduces the lives count when clicking on an error tile for the first time', async () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const lifeCount_preClick = screen.getAllByTestId('life').length;
  const tile_error = screen.getByTestId(`tile1-0`);

  await userEvent.click(tile_error);
  await userEvent.click(tile_error);
  const lifeCount_postClick = screen.getAllByTestId('life').length;

  expect(lifeCount_preClick - lifeCount_postClick).toEqual(1);
});

it('does not change the lives count when there is no error made', async () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const lifeCount_preClick = screen.getAllByTestId('life').length;
  const tile_fill = screen.getByTestId(`tile0-0`);

  await userEvent.click(tile_fill);
  const lifeCount_postClick = screen.getAllByTestId('life').length;
  expect(lifeCount_preClick - lifeCount_postClick).toEqual(0);
});

/* HINTS */
// More complex hint tests go here
// Hints test file is to test very simple things, no user interaction just provide static props

// Tests for here will involve user interaction & test how hints respond to it
// Initial hint states will NOT go here, as they are based on static info
// Hint highlight on tile hover tested above, DO NOT repeat

// greys out associated hint