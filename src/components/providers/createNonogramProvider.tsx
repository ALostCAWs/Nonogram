import { useState, useEffect, useReducer, useContext } from 'react';
import { PUZZLE_ACTIONS } from 'constants/puzzleActions';
import { FILL_STATE } from "constants/fillState";
import { SelectModeContext } from 'contexts/selectModeContext';
import { PuzzleAction } from 'interfaces/puzzleAction';
import { TileState } from 'interfaces/tileState';
import { FirstLastSelectedState } from 'interfaces/firstLastSelectedState';
import { App } from 'App';
import { Board } from 'components/ui/board';
import { deselectTile, drawSelectedTileLine, hoverTile, setFirstSelectedTile, setLastSelectedTile, fillSelectedTile_CreateMode } from 'functions/tileFunctions';
import { checkBoardNotBlank } from 'functions/puzzleValidation';
import { createBlankPuzzle, createBoolPuzzle, copyCurrentPuzzle } from 'functions/puzzleSetup';
import { checkLineFilled, getColumn } from 'functions/getPuzzleInfo';
import { convertTileStateMatrixToStringMatrix } from 'functions/convertPuzzle';
import { setTileColFillState, setTileRowFillState } from 'functions/updatePuzzleLines';
import { InfoTileFunctionsContext } from 'contexts/infoTileFunctionsContext';
import { TileFunctionsContext } from 'contexts/tileFunctionsContext';

interface CreateNonogramProviderProps {
  boardHeight: number,
  boardWidth: number,
}

/**
 * Create Puzzle by providing user with a blank board & allowing them to toggle tile FILL_STATE.FILLED
 * Allows the user to create & export their own nonogram puzzle of a specified size
 *
 * @returns The Board containing the InfoTiles & Tiles to create the game with
 * @returns Loads the home screen when the puzzle is exported
 */
export const CreateNonogramProvider = ({ boardHeight, boardWidth }: CreateNonogramProviderProps) => {
  const { selectMode, setSelectMode } = useContext(SelectModeContext);
  const [submit, setSubmit] = useState<boolean>(false);
  const [boardBlank, setBoardBlank] = useState<boolean>(true);
  const [firstSelected, setFirstSelected] = useState<FirstLastSelectedState>({ rowIndex: null, colIndex: null });
  const [lastSelected, setLastSelected] = useState<FirstLastSelectedState>({ rowIndex: null, colIndex: null });
  const [currentPuzzle, currentPuzzleDispatch] = useReducer(currentPuzzleReducer, createBlankPuzzle(boardHeight, boardWidth));

  function currentPuzzleReducer(puzzleState: TileState[][], action: PuzzleAction): TileState[][] {
    const rowIndex = action.rowIndex;
    const colIndex = action.colIndex;

    switch (action.type) {
      case PUZZLE_ACTIONS.SET_FIRST_SELECT:
        return setFirstSelectedTile(setFirstSelected, puzzleState, rowIndex, colIndex);

      case PUZZLE_ACTIONS.SET_LAST_SELECT:
        return setLastSelectedTile(setLastSelected, puzzleState, firstSelected, rowIndex, colIndex);

      case PUZZLE_ACTIONS.DRAW_SELECT_LINE:
        return drawSelectedTileLine(puzzleState, firstSelected, lastSelected);

      case PUZZLE_ACTIONS.FILL_SELECT_LINE: {
        if (!puzzleState[rowIndex][colIndex].selected) {
          return puzzleState;
        }

        let updatedPuzzle = fillSelectedTile_CreateMode(puzzleState, firstSelected, lastSelected);
        updatedPuzzle = deselectTile(updatedPuzzle, setFirstSelected, setLastSelected)
        return updatedPuzzle;
      }

      case PUZZLE_ACTIONS.DESELECT:
        return deselectTile(puzzleState, setFirstSelected, setLastSelected);

      case PUZZLE_ACTIONS.SET_ROW_FILL: {
        let updatedPuzzle = copyCurrentPuzzle(puzzleState);
        const fillToSet = checkLineFilled(updatedPuzzle[rowIndex]) ? FILL_STATE.EMPTY : FILL_STATE.FILLED;
        updatedPuzzle = setTileRowFillState(updatedPuzzle, rowIndex, fillToSet);
        return updatedPuzzle;
      }

      case PUZZLE_ACTIONS.SET_COL_FILL: {
        let updatedPuzzle = copyCurrentPuzzle(puzzleState);
        const fillToSet = checkLineFilled(getColumn(updatedPuzzle, colIndex)) ? FILL_STATE.EMPTY : FILL_STATE.FILLED;
        updatedPuzzle = setTileColFillState(updatedPuzzle, colIndex, fillToSet);
        return updatedPuzzle;
      }

      default:
        return puzzleState;
    }
  }

  useEffect(() => {
    setBoardBlank(!checkBoardNotBlank(convertTileStateMatrixToStringMatrix(currentPuzzle)));
  }, [currentPuzzle, boardBlank]);

  useEffect(() => {
    console.log(firstSelected);
  }, [firstSelected]);

  useEffect(() => {
    if (lastSelected.rowIndex !== null && lastSelected.colIndex !== null) {
      currentPuzzleDispatch({ type: PUZZLE_ACTIONS.DRAW_SELECT_LINE, rowIndex: lastSelected.rowIndex, colIndex: lastSelected.colIndex });
    }
  }, [lastSelected]);

  useEffect(() => {
    if (!selectMode) {
      currentPuzzleDispatch({ type: PUZZLE_ACTIONS.DESELECT, rowIndex: 0, colIndex: 0 });
    }
  }, [selectMode]);

  const infoTileFunctions = {
    setRowFill: (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
      currentPuzzleDispatch({ type: PUZZLE_ACTIONS.SET_ROW_FILL, rowIndex: rowIndex, colIndex: colIndex })
    },
    setColFill: (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
      currentPuzzleDispatch({ type: PUZZLE_ACTIONS.SET_COL_FILL, rowIndex: rowIndex, colIndex: colIndex })
    }
  }

  const tileFunctions = {
    setFirstSelectTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
      currentPuzzleDispatch({ type: PUZZLE_ACTIONS.SET_FIRST_SELECT, rowIndex: rowIndex, colIndex: colIndex })
    },
    setLastSelectTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
      currentPuzzleDispatch({ type: PUZZLE_ACTIONS.SET_LAST_SELECT, rowIndex: rowIndex, colIndex: colIndex })
    },
    fillTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
      currentPuzzleDispatch({ type: PUZZLE_ACTIONS.FILL_SELECT_LINE, rowIndex: rowIndex, colIndex: colIndex })
    },
    markTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
    hoverTile: hoverTile
  }

  return (
    <>
      {!submit && (
        <>
          <InfoTileFunctionsContext.Provider value={infoTileFunctions}>
            <TileFunctionsContext.Provider value={tileFunctions}>
              <Board currentPuzzle={currentPuzzle}
                puzzleSolution={[]}
                livesCount={undefined}
              />
            </TileFunctionsContext.Provider>
          </InfoTileFunctionsContext.Provider>
          <button type='button'
            className='export button'
            onClick={() => {
              const puzzleCode = createBoolPuzzle(convertTileStateMatrixToStringMatrix(currentPuzzle));
              navigator.clipboard.writeText(puzzleCode).catch((e) => (console.error(e)));
              setSubmit(true);
            }}
            disabled={boardBlank}>Export</button>
        </>
      )}
      {submit && (
        <>
          <App />
        </>
      )}
    </>
  );
}