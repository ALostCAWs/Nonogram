import { useState, useEffect, useReducer } from 'react';
import { PUZZLE_ACTIONS } from 'constants/puzzleActions';
import { FillModeContext } from 'contexts/fillModeContext';
import { Board } from 'components/ui/board';
import { GameComplete } from 'pages/gameComplete';
import { GameOver } from 'pages/gameOver';
import { fillTile, markTile, hoverTile, resetInfoTiles } from 'functions/tileFunctions';
import { createLives, createCurrentPuzzle, checkAndSetZeroLines } from 'functions/puzzleSetup';
import { checkPuzzleComplete, checkGameOver } from 'functions/getPuzzleInfo';

interface PlayNonogramProviderProps {
  puzzleSolution: boolean[][]
}

/**
 * Allows the user to play an imported nonogram puzzle
 *
 * Knows the puzzleSolution
 * Secondary currentPuzzle, same size as puzzleSolution, manages the users' progress
 *
 * Sets the FillModeContext, which is used to dictate which function the Tile components use as their onClick callback functions
 *
 * Tiles use callbacks to functions within when onClick
 * When Tile filled, PlayNonogramProvider checks for column / row completion
 *
 * @returns GameOver
 * @returns GameComplete
 * @returns The Board containing the InfoTiles ( hints ), Tiles for user interaction, & Lives
 * @returns Loads the Board with empty functions passed to the Tiles when the game has ended to prevent further user interaction
 */
export const PlayNonogramProvider = ({ puzzleSolution }: PlayNonogramProviderProps) => {
  const [fillMode, setFillMode] = useState<boolean>(true);
  const [lives, setLives] = useState<number>(createLives(puzzleSolution));
  const [gameOver, setGameOver] = useState<boolean>(checkGameOver(lives));
  const [gameComplete, setGameComplete] = useState<boolean>(false);

  const [currentPuzzle, currentPuzzleDispatch] = useReducer(currentPuzzleReducer, createCurrentPuzzle(puzzleSolution));

  interface PuzzleAction {
    type: string,
    rowIndex: number,
    colIndex: number
  }

  function currentPuzzleReducer(puzzleState: string[][], action: PuzzleAction): string[][] {
    switch (action.type) {
      case PUZZLE_ACTIONS.RESET: {
        const resetPuzzle = checkAndSetZeroLines(createCurrentPuzzle(puzzleSolution), puzzleSolution);
        setLives(createLives(puzzleSolution));
        setGameComplete(checkPuzzleComplete(puzzleSolution, resetPuzzle));
        resetInfoTiles(puzzleSolution);
        return resetPuzzle
      }

      case PUZZLE_ACTIONS.SET_ZERO_LINES:
        return puzzleState = checkAndSetZeroLines(puzzleState, puzzleSolution);

      case PUZZLE_ACTIONS.FILL: {
        const updatedPuzzleData = fillTile(puzzleSolution, puzzleState, action.rowIndex, action.colIndex);

        // Tile unfillable
        if (updatedPuzzleData.tileFilled === null) {
          return updatedPuzzleData.puzzle;
        }
        // Error, reduce lives
        if (!updatedPuzzleData.tileFilled) {
          setLives(currentLives => currentLives - 1);
        }

        setGameComplete(updatedPuzzleData.gameComplete);

        return updatedPuzzleData.puzzle;
      }

      case PUZZLE_ACTIONS.MARK:
        return puzzleState = markTile(puzzleState, action.rowIndex, action.colIndex);

      default:
        return puzzleState;
    }
  }

  useEffect(() => {
    // Triggers on component mount to ensure the fillMode is true on game start
    setFillMode(true);
  }, []);

  useEffect(() => {
    // Triggers on the change of the lives state to ensure the game ends when the user runs out of lives
    setGameOver(checkGameOver(lives));
  }, [lives]);

  useEffect(() => {
    // useEffect triggers on gameComplete change to call set any zero lines to FILL_STATE.ERROR
    // Ensures zero lines are filled correctly when puzzle reset
    currentPuzzleDispatch({ type: PUZZLE_ACTIONS.SET_ZERO_LINES, rowIndex: 0, colIndex: 0 });
  }, [gameComplete]);

  useEffect(() => {
    // useEffect triggers on puzzleSolution change to call resetPuzzle
    currentPuzzleDispatch({ type: PUZZLE_ACTIONS.RESET, rowIndex: 0, colIndex: 0 });
  }, [puzzleSolution]);

  /**
   * Disallow toggle when the game is finished
   * @returns {void} void
   */
  const toggleFillMode = (): void => {
    if (gameComplete || gameOver) {
      return;
    }
    setFillMode(currentMode => !currentMode);
  }

  return (
    <>
      {gameOver && (
        <GameOver resetPuzzle={() => { currentPuzzleDispatch({ type: PUZZLE_ACTIONS.RESET, rowIndex: 0, colIndex: 0 }) }} />
      )}

      {gameComplete && (
        <GameComplete lives={lives}
          resetPuzzle={
            () => { currentPuzzleDispatch({ type: PUZZLE_ACTIONS.RESET, rowIndex: 0, colIndex: 0 }); }
          }
        />
      )}

      {!gameComplete && !gameOver ? (
        <FillModeContext.Provider value={fillMode}>
          <Board currentPuzzle={currentPuzzle}
            puzzleSolution={puzzleSolution}
            livesCount={lives}
            fillTile={
              (e, rowIndex, colIndex) => { currentPuzzleDispatch({ type: PUZZLE_ACTIONS.FILL, rowIndex: rowIndex, colIndex: colIndex }) }
            }
            markTile={
              (e, rowIndex, colIndex) => { currentPuzzleDispatch({ type: PUZZLE_ACTIONS.MARK, rowIndex: rowIndex, colIndex: colIndex }) }
            }
            hoverTile={hoverTile}
            setRowFill={(e, rowIndex, colIndex) => { }}
            setColFill={(e, rowIndex, colIndex) => { }}
          />
        </FillModeContext.Provider>
      ) : (
        <FillModeContext.Provider value={fillMode}>
            <Board currentPuzzle={currentPuzzle}
              puzzleSolution={puzzleSolution}
              livesCount={lives}
              fillTile={(e, rowIndex, colIndex) => { }}
              markTile={(e, rowIndex, colIndex) => { }}
              hoverTile={(e, rowIndex, colIndex) => { }}
              setRowFill={(e, rowIndex, colIndex) => { }}
              setColFill={(e, rowIndex, colIndex) => { }}
            />
        </FillModeContext.Provider>
      )}

      <button type='button' className='fillModeButton toggleFillMode button' onClick={() => toggleFillMode()} disabled={fillMode}>Fill</button>
      <button type='button' className='markModeButton toggleFillMode button' onClick={() => toggleFillMode()} disabled={!fillMode}>Mark</button>
    </>
  );
}