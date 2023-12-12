import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { FILL_STATE } from "constants/fillState";
import { FillLineToggleButton } from 'components/ui/fillLineToggleButton';
import { convertStringLineToTileStateLine } from "functions/convertPuzzle";
import { InfoTileFunctionsContext } from "contexts/infoTileFunctionsContext";

const FILLED = FILL_STATE.FILLED;
const MARKED = FILL_STATE.MARKED;
const EMPTY = FILL_STATE.EMPTY;
const ERROR = FILL_STATE.ERROR;
const COMPLETE = 'complete';

const line_String = [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];
const line = convertStringLineToTileStateLine(line_String);

it('runs the setRowFill function passed to it', async () => {
  let rowFilled = false;

  const infoTileFunctions = {
    setRowFill: () => {
      rowFilled = true;
    },
    setColFill: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { }
  }

  render(
    <InfoTileFunctionsContext.Provider value={infoTileFunctions}>
      <FillLineToggleButton
        line={line}
        lineIndex={0}
        tileSize={60}
        lineType={'row'}
      />
    </InfoTileFunctionsContext.Provider>
  );

  const rowFillLineToggleButton0 = screen.getByTestId(`rowFillToggleButton0`);

  await userEvent.click(rowFillLineToggleButton0);
  expect(rowFilled).toEqual(true);
});

it('runs the setColFill function passed to it', async () => {
  let colFilled = false;

  const infoTileFunctions = {
    setRowFill: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
    setColFill: () => {
      colFilled = true;
    }
  }

  render(
    <InfoTileFunctionsContext.Provider value={infoTileFunctions}>
      <FillLineToggleButton
        line={line}
        lineIndex={0}
        tileSize={60}
        lineType={'col'}
      />
    </InfoTileFunctionsContext.Provider>
  );

  const colFillLineToggleButton0 = screen.getByTestId(`colFillToggleButton0`);

  await userEvent.click(colFillLineToggleButton0);
  expect(colFilled).toEqual(true);
});