/* ---- Imports Section */
import { FILL_STATE } from 'constants/fillState';
import { checkLineFilled } from 'functions/getPuzzleInfo';
import { setTileColFillState, setTileRowFillState } from 'functions/updatePuzzleLines';
/* End ---- */

interface FillLineToggleButtonProps {
  currentPuzzle: string[][],
  line: string[],
  lineIndex: number,
  tileSize: number,
  lineType: string
}

/**
 * @returns A button to toggle whether each Tile in a given line is FILL_STATE FILLED or EMPTY
 */
export const FillLineToggleButton = ({ currentPuzzle, line, lineIndex, tileSize, lineType }: FillLineToggleButtonProps) => {
  const fillToSet = checkLineFilled(line) ? FILL_STATE.EMPTY : FILL_STATE.FILLED;
  const toggleFill = lineType === 'row' ? setTileRowFillState.bind(this, currentPuzzle, lineIndex, fillToSet) : setTileColFillState.bind(this, currentPuzzle, lineIndex, fillToSet);
  return (
    <>
      {checkLineFilled(line) ? (
        <button type='button'
          className='fillLineToggle button'
          style={{
            height: `20px`,
            width: `${tileSize}px`
          }}
          onClick={toggleFill}>Clear</button>
      ) : (
          <button type='button'
            className='fillLineToggle'
            style={{
              height: `20px`,
              width: `${tileSize}px`
            }}
            onClick={toggleFill}>Fill</button>
      )}
    </>
  );
};