/* ---- Imports Section */
import React from 'react';
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// Components
import App from 'App';
/* End ---- */

const puzzleCode = '5|1111101100010100110001000';

it('loads PlayGame when play is selected', async () => {
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: 'Play' }));
  expect(screen.getAllByTestId('gameCode')).not.toBeNull();
});

it('imports the game via user input', async () => {
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: 'Play' }));

  // Value entered into textbox correctly
  const importTextbox = screen.getByTestId('gameCode');
  await userEvent.type(importTextbox, puzzleCode);
  expect(importTextbox).toHaveValue(puzzleCode);

  // Ensure NonogramProvider component exists
  const playPuzzle = await screen.findByRole('button', { name: 'Play Puzzle' });
  await userEvent.click(playPuzzle);

  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Fill' })).not.toBeNull();
  });
});