import { useContext } from 'react';
import { InfoTileFunctionsContext } from 'contexts/infoTileFunctionsContext';
import { TileState } from 'interfaces/tileState';
import { checkLineFilled } from 'functions/getPuzzleInfo';

interface FillLineToggleButtonProps {
  line: TileState[],
  lineIndex: number,
  tileSize: number,
  lineType: string,
}

/**
 * @returns A button to toggle whether each Tile in a given line is FILL_STATE FILLED or EMPTY
 */
export const FillLineToggleButton = ({ line, lineIndex, tileSize, lineType }: FillLineToggleButtonProps) => {
  const infoTileFunctions = useContext(InfoTileFunctionsContext);
  const setRowFill = infoTileFunctions.setRowFill;
  const setColFill = infoTileFunctions.setColFill;

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