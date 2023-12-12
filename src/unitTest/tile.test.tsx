import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { FILL_STATE } from "constants/fillState";
import { FillModeContext } from 'contexts/fillModeContext';
import { Tile } from 'components/ui/tile';
import { SelectModeContext } from "contexts/selectModeContext";
import { TileFunctionsContext } from "contexts/tileFunctionsContext";

const EMPTY = FILL_STATE.EMPTY;

it('executes setFirstSelectTile on mouse down', () => {
  const rowIndex = 0;
  const colIndex = 0;
  let firstSelected = false;

  const tileFunctions = {
    setFirstSelectTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
      firstSelected = true;
    },
    setLastSelectTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
    fillTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
    markTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
    hoverTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { }
  }

  render(
    <FillModeContext.Provider value={true}>
      <TileFunctionsContext.Provider value={tileFunctions}>
        <Tile
          fill={EMPTY}
          selected={false}
          rowIndex={rowIndex}
          colIndex={colIndex}
          tileSize={60}
        />
      </TileFunctionsContext.Provider>
    </FillModeContext.Provider>
  );

  const tile = screen.getByTestId(`tile${rowIndex}-${colIndex}`);

  fireEvent.mouseDown(tile);
  expect(firstSelected).toEqual(true);
});

it('executes setLastSelectTile on mouse enter when selectMode true', () => {
  // Enforce selectMode always true due to current inability to test simultaneous mouseDown & mouseEnter
  const selectMode = true;
  const setSelectMode = () => {
    // Return true to prevent selectMode from returning to false when mouseEnter is fired
    return true;
  }

  let lastSelected = false;

  const tileFunctions = {
    setFirstSelectTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
    setLastSelectTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
      lastSelected = true;
    },
    fillTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
    markTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
    hoverTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { }
  }

  render(
    <SelectModeContext.Provider value={{ selectMode, setSelectMode }}>
      <FillModeContext.Provider value={true}>
        <TileFunctionsContext.Provider value={tileFunctions}>
          <Tile
            fill={EMPTY}
            selected={false}
            rowIndex={0}
            colIndex={0}
            tileSize={60}
          />
          <Tile
            fill={EMPTY}
            selected={false}
            rowIndex={0}
            colIndex={1}
            tileSize={60}
          />
        </TileFunctionsContext.Provider>
      </FillModeContext.Provider>
    </SelectModeContext.Provider>
  );

  const tile0_0 = screen.getByTestId(`tile0-0`);
  const tile0_1 = screen.getByTestId(`tile0-1`);

  fireEvent.mouseDown(tile0_0);
  fireEvent.mouseEnter(tile0_1);
  expect(lastSelected).toEqual(true);
});

it('executes fillTile on mouse up when fillMode is true', async () => {
  const rowIndex = 0;
  const colIndex = 0;
  let isFilled = false;

  const tileFunctions = {
    setFirstSelectTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
    setLastSelectTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
    fillTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
      isFilled = true;
    },
    markTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
    hoverTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { }
  }

  render(
    <FillModeContext.Provider value={true}>
      <TileFunctionsContext.Provider value={tileFunctions}>
        <Tile
          fill={EMPTY}
          selected={false}
          rowIndex={rowIndex}
          colIndex={colIndex}
          tileSize={60}
        />
      </TileFunctionsContext.Provider>
    </FillModeContext.Provider>
  );

  const tile = screen.getByTestId(`tile${rowIndex}-${colIndex}`);

  await userEvent.click(tile);
  expect(isFilled).toEqual(true);
});

it('executes markTile on mouse up when fillMode is false', async () => {
  const rowIndex = 0;
  const colIndex = 0;
  let isMarked = false;

  const tileFunctions = {
    setFirstSelectTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
    setLastSelectTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
    fillTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
    markTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
      isMarked = true;
    },
    hoverTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { }
  }

  render(
    <FillModeContext.Provider value={false}>
      <TileFunctionsContext.Provider value={tileFunctions}>
        <Tile
          fill={EMPTY}
          selected={false}
          rowIndex={rowIndex}
          colIndex={colIndex}
          tileSize={60}
        />
      </TileFunctionsContext.Provider>
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

  const tileFunctions = {
    setFirstSelectTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
    setLastSelectTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
    fillTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
    markTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
    hoverTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
      if (e.type === 'mouseenter') {
        isHovered = true;
      }
      if (e.type === 'mouseleave') {
        isHovered = false;
      }
    }
  }

  render(
    <TileFunctionsContext.Provider value={tileFunctions}>
      <Tile
        fill={EMPTY}
        selected={false}
        rowIndex={rowIndex}
        colIndex={colIndex}
        tileSize={60}
      />
    </TileFunctionsContext.Provider>
  );

  const tile = screen.getByTestId(`tile${rowIndex}-${colIndex}`);

  // mouseenter
  await userEvent.hover(tile);
  expect(isHovered).toEqual(true);
  // mouseleave
  await userEvent.unhover(tile);
  expect(isHovered).toEqual(false);
});