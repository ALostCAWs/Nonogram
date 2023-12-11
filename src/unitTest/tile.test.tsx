import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FILL_STATE } from "constants/fillState";
import { FillModeContext } from 'contexts/fillModeContext';
import { Tile } from 'components/ui/tile';

const EMPTY = FILL_STATE.EMPTY;

it('executes fillTile on mouse up when fillMode is true', async () => {
  const rowIndex = 0;
  const colIndex = 0;

  let isFilled = false;
  const fillTile = () => {
    isFilled = true;
  }

  render(
    <FillModeContext.Provider value={true}>
      <Tile
        fill={EMPTY}
        selected={false}
        rowIndex={rowIndex}
        colIndex={colIndex}
        tileSize={60}
        setFirstSelectTile={(e, rowIndex, colIndex) => { }}
        setLastSelectTile={(e, rowIndex, colIndex) => { }}
        deselectTile={(e, rowIndex, colIndex) => { }}
        fillTile={fillTile}
        markTile={(e, rowIndex, colIndex) => { }}
        hoverTile={(e, rowIndex, colIndex) => { }}
      />
    </FillModeContext.Provider>
  );

  const tile = screen.getByTestId(`tile${rowIndex}-${colIndex}`);

  await userEvent.click(tile);
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
      <Tile
        fill={EMPTY}
        selected={false}
        rowIndex={rowIndex}
        colIndex={colIndex}
        tileSize={60}
        setFirstSelectTile={(e, rowIndex, colIndex) => { }}
        setLastSelectTile={(e, rowIndex, colIndex) => { }}
        deselectTile={(e, rowIndex, colIndex) => { }}
        fillTile={(e, rowIndex, colIndex) => { }}
        markTile={markTile}
        hoverTile={(e, rowIndex, colIndex) => { }}
      />
    </FillModeContext.Provider>
  );

  const tile = screen.getByTestId(`tile${rowIndex}-${colIndex}`);

  await userEvent.click(tile);
  expect(isMarked).toEqual(true);
});

it('executes hoverTile on mouseenter & on mouseleave', async () => {
  const rowIndex = 0;
  const colIndex = 0;

  let isHovered = false;
  const hoverTile = (e: React.MouseEvent) => {
    if (e.type === 'mouseenter') {
      isHovered = true;
    }
    if (e.type === 'mouseleave') {
      isHovered = false;
    }
  }

  render(
    <Tile
      fill={EMPTY}
      selected={false}
      rowIndex={rowIndex}
      colIndex={colIndex}
      tileSize={60}
      setFirstSelectTile={(e, rowIndex, colIndex) => { }}
      setLastSelectTile={(e, rowIndex, colIndex) => { }}
      deselectTile={(e, rowIndex, colIndex) => { }}
      markTile={(e, rowIndex, colIndex) => { }}
      fillTile={(e, rowIndex, colIndex) => { }}
      hoverTile={hoverTile}
    />
  );

  const tile = screen.getByTestId(`tile${rowIndex}-${colIndex}`);

  // mouseenter
  await userEvent.hover(tile);
  expect(isHovered).toEqual(true);
  // mouseleave
  await userEvent.unhover(tile);
  expect(isHovered).toEqual(false);
});