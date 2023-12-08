/* ---- Imports Section */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// Constants
import { GAME_MODE_STATE } from 'constants/gameModeState';
import { FILL_STATE } from "constants/fillState";
// Contexts
import { GameModeContext } from 'contexts/gameModeContext';
// Components > UI
import { PlayNonogramProvider } from 'components/providers/playNonogramProvider';
/* End ---- */

const FILLED = FILL_STATE.FILLED;
const MARKED = FILL_STATE.MARKED;
const ERROR = FILL_STATE.ERROR;
const COMPLETE = 'complete';

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
it('initializes the tiles with FILL_STATE.EMPTY', () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  // true tile
  const tile_true = screen.getByTestId(`tile0-0`);
  expect(tile_true).not.toHaveClass(FILLED, MARKED, ERROR, COMPLETE);

  // false tile
  const tile_false = screen.getByTestId(`tile1-0`);
  expect(tile_false).not.toHaveClass(FILLED, MARKED, ERROR, COMPLETE);
});

it('initializes the tiles in false-only columns with FILL_STATE.ERROR', () => {
  const puzzleSolution5x5_FalseCol = [[true, true, true, true, false],
  [false, true, false, false, false],
  [false, true, false, true, false],
  [true, true, true, false, false],
  [false, false, false, false, false]];
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5_FalseCol} />);

  expect(screen.getByTestId(`tile0-4`)).toHaveClass(ERROR);
  expect(screen.getByTestId(`tile1-4`)).toHaveClass(ERROR);
  expect(screen.getByTestId(`tile2-4`)).toHaveClass(ERROR);
  expect(screen.getByTestId(`tile3-4`)).toHaveClass(ERROR);
  expect(screen.getByTestId(`tile4-4`)).toHaveClass(ERROR);
});

it('initializes the tiles in false-only rows with FILL_STATE.ERROR', () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);

  expect(screen.getByTestId(`tile4-0`)).toHaveClass(ERROR);
  expect(screen.getByTestId(`tile4-1`)).toHaveClass(ERROR);
  expect(screen.getByTestId(`tile4-2`)).toHaveClass(ERROR);
  expect(screen.getByTestId(`tile4-3`)).toHaveClass(ERROR);
  expect(screen.getByTestId(`tile4-4`)).toHaveClass(ERROR);
});

it('highlights the associated info tiles on hover', async () => {
  const rowIndex = 0;
  const colIndex = 0;

  render(
    <GameModeContext.Provider value={GAME_MODE_STATE.PLAY} >
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
  expect(tile).toHaveClass(FILLED);
});

it('errors tiles that are true according to the puzzleSolution array', async () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const tile = screen.getByTestId(`tile1-0`);
  await userEvent.click(tile);
  expect(tile).toHaveClass(ERROR);
});

it('marks empty tiles regardless of puzzleSolution array', async () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  await userEvent.click(screen.getByRole('button', { name: 'Mark' }));
  const tile_true = screen.getByTestId(`tile0-0`);
  const tile_false = screen.getByTestId(`tile1-0`);

  // Mark
  await userEvent.click(tile_true);
  expect(tile_true).toHaveClass(MARKED);
  await userEvent.click(tile_false);
  expect(tile_false).toHaveClass(MARKED);

  // Unmark
  await userEvent.click(tile_true);
  expect(tile_true).not.toHaveClass(MARKED);
  await userEvent.click(tile_false);
  expect(tile_false).not.toHaveClass(MARKED);
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
  expect(tile_mark).toHaveClass(COMPLETE);
  expect(tile_completeMark_1).toHaveClass(COMPLETE);
  expect(tile_completeMark_2).toHaveClass(COMPLETE);
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
    expect(tile_mark).toHaveClass(COMPLETE);
    expect(tile_completeMark_1).toHaveClass(COMPLETE);
    expect(tile_completeMark_2).toHaveClass(COMPLETE);
    expect(tile_completeMark_3).toHaveClass(COMPLETE);
  });
});

// Fill / Error / Mark - Preventative functionality tests
it('prevents filled tiles from being unfilled or marked', async () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const tile = screen.getByTestId(`tile0-0`)
  await userEvent.click(tile);
  expect(tile).toHaveClass(FILLED);

  // Retain filled class after additional fillMode true click
  await userEvent.click(tile);
  expect(tile).toHaveClass(FILLED);

  // Retain filled class after mark attempt with fillMode false click
  await userEvent.click(screen.getByRole('button', { name: 'Mark' }));
  await userEvent.click(tile);
  expect(tile).toHaveClass(FILLED);
  expect(tile).not.toHaveClass(MARKED);
});

it(`prevents error'd tiles from being unerror'd or marked`, async () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  const tile = screen.getByTestId(`tile1-0`)
  await userEvent.click(tile);
  expect(tile).toHaveClass(ERROR);

  // Retain error class after additional fillMode true click
  await userEvent.click(tile);
  expect(tile).toHaveClass(ERROR);

  // Retain error class after mark attempt with fillMode false click
  await userEvent.click(screen.getByRole('button', { name: 'Mark' }));
  await userEvent.click(tile);
  expect(tile).toHaveClass(ERROR);
  expect(tile).not.toHaveClass(MARKED);
});

it(`prevents marked tiles from being filled / error'd`, async () => {
  render(<PlayNonogramProvider puzzleSolution={puzzleSolution5x5} />);
  await userEvent.click(screen.getByRole('button', { name: 'Mark' }));
  const tile_mark = screen.getByTestId(`tile0-0`);

  await userEvent.click(tile_mark);
  await userEvent.click(screen.getByRole('button', { name: 'Fill' }));
  await userEvent.click(tile_mark);
  expect(tile_mark).toHaveClass(MARKED);
  expect(tile_mark).not.toHaveClass(FILLED, ERROR);
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
  expect(tile_completeMark_1).toHaveClass(COMPLETE);
  expect(tile_completeMark_1).not.toHaveClass(FILLED, ERROR);

  await userEvent.click(tile_completeMark_2);
  expect(tile_completeMark_2).toHaveClass(COMPLETE);
  expect(tile_completeMark_2).not.toHaveClass(FILLED, ERROR);

  // Attempt mark / unmark of complete tiles
  await userEvent.click(screen.getByRole('button', { name: 'Mark' }));
  await userEvent.click(tile_completeMark_1);
  expect(tile_completeMark_1).toHaveClass(COMPLETE);
  expect(tile_completeMark_1).not.toHaveClass(FILLED, ERROR);

  await userEvent.click(tile_completeMark_2);
  expect(tile_completeMark_2).toHaveClass(COMPLETE);
  expect(tile_completeMark_2).not.toHaveClass(FILLED, ERROR);
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