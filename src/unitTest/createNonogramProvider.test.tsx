import { fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { GAME_MODE_STATE } from 'constants/gameModeState';
import { FILL_STATE } from "constants/fillState";
import { GameModeContext } from 'contexts/gameModeContext';
import { CreateNonogramProvider } from 'components/providers/createNonogramProvider';
import { SelectModeContext } from "contexts/selectModeContext";

const FILLED = FILL_STATE.FILLED;
const MARKED = FILL_STATE.MARKED;
const ERROR = FILL_STATE.ERROR;
const COMPLETE = 'complete';

const SELECTED = 'selected';

it('initializes the tiles with FILL_STATE.EMPTY', () => {
  render(<CreateNonogramProvider boardHeight={5} boardWidth={5} />);

  const tile0_0 = screen.getByTestId(`tile0-0`);
  expect(tile0_0).not.toHaveClass(FILLED, MARKED, ERROR, COMPLETE);
});

it('initializes the board with the inputted dimensions', () => {
  render(<CreateNonogramProvider boardHeight={5} boardWidth={5} />);

  const tile0_0 = screen.getByTestId(`tile0-0`);
  expect(tile0_0).not.toBeNull();

  const tile0_5 = screen.queryByTestId(`tile0-5`);
  expect(tile0_5).toBeNull();
  const tile5_0 = screen.queryByTestId(`tile5-0`);
  expect(tile5_0).toBeNull();
});

it('disables the Export button when the board is blank', async () => {
  render(<CreateNonogramProvider boardHeight={5} boardWidth={5} />);
  const exportBtn = screen.getByRole('button', { name: 'Export' });
  const tile0_0 = screen.getByTestId(`tile0-0`);

  expect(exportBtn).toBeDisabled();

  await userEvent.click(tile0_0);
  expect(exportBtn).not.toBeDisabled();

  await userEvent.click(tile0_0);
  expect(exportBtn).toBeDisabled();
});

it('toggles the tile FILL_STATE between empty and filled', async () => {
  render(<CreateNonogramProvider boardHeight={5} boardWidth={5} />);
  const tile0_0 = screen.getByTestId(`tile0-0`);

  await userEvent.click(tile0_0);
  expect(tile0_0).toHaveClass(FILLED);
  expect(tile0_0).not.toHaveClass(MARKED, ERROR, COMPLETE);

  await userEvent.click(tile0_0);
  expect(tile0_0).not.toHaveClass(FILLED, MARKED, ERROR, COMPLETE);
});

it(`sets tiles' selected property to true on mouse down`, () => {
  const selectMode = false;
  const setSelectMode = (selectMode: boolean) => {
    return selectMode = !selectMode;
  }

  render(
    <SelectModeContext.Provider value={{ selectMode, setSelectMode }}>
      <CreateNonogramProvider boardHeight={5} boardWidth={5} />
    </SelectModeContext.Provider>
  );
  const tile0_0 = screen.getByTestId(`tile0-0`);

  fireEvent.mouseDown(tile0_0);
  expect(tile0_0).toHaveClass(SELECTED);
});

it(`sets tiles' selected property of a valid hovered tile to true while selectMode is true (on mouse down of a tile)`, () => {
  // Enforce selectMode always true due to current inability to test simultaneous mouseDown & mouseEnter
  const selectMode = true;
  const setSelectMode = () => {
    // Return true to prevent selectMode from returning to false when mouseEnter is fired
    return true;
  }

  render(
    <SelectModeContext.Provider value={{ selectMode, setSelectMode }}>
      <CreateNonogramProvider boardHeight={5} boardWidth={5} />
    </SelectModeContext.Provider>
  );
  const tile0_0 = screen.getByTestId(`tile0-0`);
  const tile0_1 = screen.getByTestId(`tile0-1`);

  fireEvent.mouseDown(tile0_0);
  fireEvent.mouseEnter(tile0_1);

  expect(tile0_0).toHaveClass(SELECTED);
  expect(tile0_1).toHaveClass(SELECTED);
});

it(`sets tiles' selected property of the first, last, & tile between them`, () => {
  // Enforce selectMode always true due to current inability to test simultaneous mouseDown & mouseEnter
  const selectMode = true;
  const setSelectMode = () => {
    // Return true to prevent selectMode from returning to false when mouseEnter is fired
    return true;
  }

  render(
    <SelectModeContext.Provider value={{ selectMode, setSelectMode }}>
      <CreateNonogramProvider boardHeight={5} boardWidth={5} />
    </SelectModeContext.Provider>
  );
  const tile0_0 = screen.getByTestId(`tile0-0`);
  const tile0_1 = screen.getByTestId(`tile0-1`);
  const tile0_2 = screen.getByTestId(`tile0-2`);
  const tile0_3 = screen.getByTestId(`tile0-3`);
  const tile0_4 = screen.getByTestId(`tile0-4`);

  fireEvent.mouseDown(tile0_0);
  fireEvent.mouseEnter(tile0_1);
  fireEvent.mouseEnter(tile0_2);
  fireEvent.mouseEnter(tile0_3);
  fireEvent.mouseEnter(tile0_4);

  expect(tile0_0).toHaveClass(SELECTED);
  expect(tile0_1).toHaveClass(SELECTED);
  expect(tile0_2).toHaveClass(SELECTED);
  expect(tile0_3).toHaveClass(SELECTED);
  expect(tile0_4).toHaveClass(SELECTED);
});

it(`does not set tiles' selected property of a valid hovered tile to true while selectMode is true (on mouse down of a tile)`, () => {
  // Enforce selectMode always false due to current inability to test simultaneous mouseDown & mouseEnter
  const selectMode = false;
  const setSelectMode = () => {
    // Return false to prevent selectMode from returning to false when mouseEnter is fired
    return false;
  }

  render(
    <SelectModeContext.Provider value={{ selectMode, setSelectMode }}>
      <CreateNonogramProvider boardHeight={5} boardWidth={5} />
    </SelectModeContext.Provider>
  );
  const tile0_0 = screen.getByTestId(`tile0-0`);

  fireEvent.mouseEnter(tile0_0);

  expect(tile0_0).not.toHaveClass(SELECTED);
});

it('clicking FillLineToggleButton on a non-full line sets all tiles in a given line to FILL_STATE.FILLED', async () => {
  render(
    <GameModeContext.Provider value={GAME_MODE_STATE.CREATE}>
      <CreateNonogramProvider boardHeight={5} boardWidth={5} />
    </GameModeContext.Provider>
  );
  const rowFillLineToggleButton0 = screen.getByTestId(`rowFillToggleButton0`);
  const colFillLineToggleButton0 = screen.getByTestId(`colFillToggleButton0`);

  await userEvent.click(rowFillLineToggleButton0);
  await userEvent.click(colFillLineToggleButton0);

  // Corner
  expect(screen.getByTestId(`tile0-0`)).toHaveClass(FILLED);
  //Row
  expect(screen.getByTestId(`tile0-1`)).toHaveClass(FILLED);
  expect(screen.getByTestId(`tile0-2`)).toHaveClass(FILLED);
  expect(screen.getByTestId(`tile0-3`)).toHaveClass(FILLED);
  expect(screen.getByTestId(`tile0-4`)).toHaveClass(FILLED);
  // Col
  expect(screen.getByTestId(`tile1-0`)).toHaveClass(FILLED);
  expect(screen.getByTestId(`tile2-0`)).toHaveClass(FILLED);
  expect(screen.getByTestId(`tile3-0`)).toHaveClass(FILLED);
  expect(screen.getByTestId(`tile4-0`)).toHaveClass(FILLED);
});

it('clicking FillLineToggleButton on a full line sets all tiles in a given line to FILL_STATE.EMPTY', async () => {
  render(
    <GameModeContext.Provider value={GAME_MODE_STATE.CREATE}>
      <CreateNonogramProvider boardHeight={5} boardWidth={5} />
    </GameModeContext.Provider>
  );
  const rowFillLineToggleButton0 = screen.getByTestId(`rowFillToggleButton0`);
  const colFillLineToggleButton0 = screen.getByTestId(`colFillToggleButton0`);

  await userEvent.click(rowFillLineToggleButton0);
  await userEvent.click(colFillLineToggleButton0);

  await userEvent.click(rowFillLineToggleButton0);
  await userEvent.click(colFillLineToggleButton0);

  // Corner
  expect(screen.getByTestId(`tile0-0`)).not.toHaveClass(FILLED, ERROR, MARKED, COMPLETE);
  //Row
  expect(screen.getByTestId(`tile0-1`)).not.toHaveClass(FILLED, ERROR, MARKED, COMPLETE);
  expect(screen.getByTestId(`tile0-2`)).not.toHaveClass(FILLED, ERROR, MARKED, COMPLETE);
  expect(screen.getByTestId(`tile0-3`)).not.toHaveClass(FILLED, ERROR, MARKED, COMPLETE);
  expect(screen.getByTestId(`tile0-4`)).not.toHaveClass(FILLED, ERROR, MARKED, COMPLETE);
  // Col
  expect(screen.getByTestId(`tile1-0`)).not.toHaveClass(FILLED, ERROR, MARKED, COMPLETE);
  expect(screen.getByTestId(`tile2-0`)).not.toHaveClass(FILLED, ERROR, MARKED, COMPLETE);
  expect(screen.getByTestId(`tile3-0`)).not.toHaveClass(FILLED, ERROR, MARKED, COMPLETE);
  expect(screen.getByTestId(`tile4-0`)).not.toHaveClass(FILLED, ERROR, MARKED, COMPLETE);
});

it('exports a non-blank puzzle and returns to the App component', async () => {
  render(<CreateNonogramProvider boardHeight={5} boardWidth={5} />);

  // Create userEvent.setup() instance so that the function is able to write to the users' clipboard
  const user = userEvent.setup();

  // Simulate user interactions
  await user.click(screen.getByTestId(`tile0-0`));
  await user.click(screen.getByRole('button', { name: 'Export' }));

  // Capture text written to the clipboard & assert it
  const clipboardText = await navigator.clipboard.readText();
  expect(clipboardText).toBe('5|1000000000000000000000000');

  // Assert that the CreateNonogramProvider component unmounted & that the App component has mounted
  expect(screen.queryByTestId('tile0-0')).toBeNull();
  expect(screen.queryByRole('button', { name: 'Export' })).toBeNull();
  expect(screen.queryByRole('button', { name: 'Play' })).not.toBeNull();
  expect(screen.queryByRole('button', { name: 'Create' })).not.toBeNull();
});