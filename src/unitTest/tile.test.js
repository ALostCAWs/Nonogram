/* ---- Imports Section */
import react from 'react';
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fillState } from "../nonogram/state.js";
import { FillModeContext } from '../nonogram/playGame/nonogramProvider.js';
// Components
import { Tile } from '../nonogram/boardDisplay/tile.js';
/* End ---- */

const empty = fillState.empty;

// break down tests into very small component-specific parts
// test their basic abilities, i.e., whether the tile calls the functions passed to it correctly
// nonogramprovider will test the proper function of the onclick / hover etc.
// render tile & pass very simple onclick

// screen.debug()
// print dom of rendered items for unit test

it('executes fillTile on click when fillMode is true', async () => {
  const rowIndex = 0;
  const colIndex = 0;

  let isFilled = false;
  const fillTile = () => {
    isFilled = true;
  }

  render(
    <FillModeContext.Provider value={true}>
      <Tile fill={empty} rowIndex={rowIndex} colIndex={colIndex} tileSize={60} fillTile={fillTile} />
    </FillModeContext.Provider>
  );

  const tile = screen.getByTestId(`tile${rowIndex}-${colIndex}`);

  userEvent.click(tile);
  expect(isFilled).toEqual(true);
});

it('executes markTile on click when fillMode is false', async () => {
  const rowIndex = 0;
  const colIndex = 0;

  let isMarked = false;
  const markTile = () => {
    isMarked = true;
  }

  render(
    <FillModeContext.Provider value={false}>
      <Tile fill={empty} rowIndex={rowIndex} colIndex={colIndex} tileSize={60} markTile={markTile} />
    </FillModeContext.Provider>
  );

  const tile = screen.getByTestId(`tile${rowIndex}-${colIndex}`);

  userEvent.click(tile);
  expect(isMarked).toEqual(true);
});

it('executes hoverTile on mouseenter & on mouseleave', async () => {
  const rowIndex = 0;
  const colIndex = 0;

  let isHovered = false;
  const hoverTile = (e) => {
    if (e.type === 'mouseenter') {
      isHovered = true;
    }
    if (e.type === 'mouseleave') {
      isHovered = false;
    }
  }

  render(
    <Tile fill={empty} rowIndex={rowIndex} colIndex={colIndex} tileSize={60} hoverTile={hoverTile} />
  );

  const tile = screen.getByTestId(`tile${rowIndex}-${colIndex}`);

  // mouseenter
  userEvent.hover(tile);
  expect(isHovered).toEqual(true);
  // mouseleave
  userEvent.unhover(tile);
  expect(isHovered).toEqual(false);
});