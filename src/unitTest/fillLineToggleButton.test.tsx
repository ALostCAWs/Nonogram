import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FILL_STATE } from "constants/fillState";
import { FillLineToggleButton } from 'components/ui/fillLineToggleButton';

const FILLED = FILL_STATE.FILLED;
const MARKED = FILL_STATE.MARKED;
const EMPTY = FILL_STATE.EMPTY;
const ERROR = FILL_STATE.ERROR;
const COMPLETE = 'complete';

const line = [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];

it('runs the setRowFill function passed to it', async () => {
  let rowFilled = false;
  const setRowFill = () => {
    rowFilled = true;
  }

  render(<FillLineToggleButton
    line={line}
    setRowFill={setRowFill}
    setColFill={(e, rowIndex, colIndex) => { }}
    lineIndex={0}
    tileSize={60}
    lineType={'row'} />);

  const rowFillLineToggleButton0 = screen.getByTestId(`rowFillToggleButton0`);

  await userEvent.click(rowFillLineToggleButton0);
  expect(rowFilled).toEqual(true);
});

it('runs the setColFill function passed to it', async () => {
  let colFilled = false;
  const setColFill = () => {
    colFilled = true;
  }

  render(<FillLineToggleButton
    line={line}
    setRowFill={(e, rowIndex, colIndex) => { }}
    setColFill={setColFill}
    lineIndex={0}
    tileSize={60}
    lineType={'col'} />);

  const colFillLineToggleButton0 = screen.getByTestId(`colFillToggleButton0`);

  await userEvent.click(colFillLineToggleButton0);
  expect(colFilled).toEqual(true);
});