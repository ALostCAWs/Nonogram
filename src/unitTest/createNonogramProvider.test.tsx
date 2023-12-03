/* ---- Imports Section */
import React from 'react';
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fillState } from "constants/fillState";
// Components
import { CreateNonogramProvider } from 'components/providers/createNonogramProvider';
/* End ---- */

const filled = fillState.filled;
const marked = fillState.marked;
const error = fillState.error;
const complete = 'complete';

it('initializes the tiles with fillState.empty', () => {
  render(<CreateNonogramProvider boardHeight={5} boardWidth={5} />);

  const tile0_0 = screen.getByTestId(`tile0-0`);
  expect(tile0_0).not.toHaveClass(filled, marked, error, complete);
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

it('toggles the tile fillState between empty and filled', async () => {
  render(<CreateNonogramProvider boardHeight={5} boardWidth={5} />);
  const tile0_0 = screen.getByTestId(`tile0-0`);

  await userEvent.click(tile0_0);
  expect(tile0_0).toHaveClass(filled);
  expect(tile0_0).not.toHaveClass(marked, error, complete);

  await userEvent.click(tile0_0);
  expect(tile0_0).not.toHaveClass(filled, marked, error, complete);
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