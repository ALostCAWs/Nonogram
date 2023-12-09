import { CurrentPuzzle } from 'interfaces/currentPuzzle';
import { checkLineFilled } from 'functions/getPuzzleInfo';

interface FillLineToggleButtonProps {
  line: CurrentPuzzle[],
  setRowFill: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void,
  setColFill: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void,
  lineIndex: number,
  tileSize: number,
  lineType: string
}

/**
 * @returns A button to toggle whether each Tile in a given line is FILL_STATE FILLED or EMPTY
 */
export const FillLineToggleButton = ({ setRowFill, setColFill, line, lineIndex, tileSize, lineType }: FillLineToggleButtonProps) => {
  //const fillToSet = checkLineFilled(line) ? FILL_STATE.EMPTY : FILL_STATE.FILLED;
  //const toggleFill = lineType === 'row' ? setRowFill.bind(e, lineIndex, 0) : setColFill.bind(e, lineIndex, 0);
  return (
    <>
      {checkLineFilled(line) ? (
        <button type='button'
          data-testid={`${lineType}FillToggleButton${lineIndex}`}
          className='fillLineToggle'
          style={{
            height: `20px`,
            width: `${tileSize}px`
          }}
          onClick={lineType === 'row' ? (
            (e) => setRowFill(e, lineIndex, 0)
          ) : (
            (e) => setColFill(e, 0, lineIndex)
          )}>Clear</button>
      ) : (
          <button type='button'
            data-testid={`${lineType}FillToggleButton${lineIndex}`}
            className='fillLineToggle'
            style={{
              height: `20px`,
              width: `${tileSize}px`
            }}
            onClick={lineType === 'row' ? (
              (e) => setRowFill(e, lineIndex, 0)
            ) : (
              (e) => setColFill(e, 0, lineIndex)
            )}>Fill</button>
      )}
    </>
  );
};