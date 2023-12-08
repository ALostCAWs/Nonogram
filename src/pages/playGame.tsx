import React, { useState, useRef } from 'react';
import { Puzzle } from 'constants/puzzleInterface';
import { PlayNonogramProvider } from 'components/providers/playNonogramProvider';
import { importPuzzle } from 'functions/importPuzzle';
import { checkSolutionNotBlank, checkPuzzleRectangular } from 'functions/puzzleValidation';

/**
 * Import Game via code entered into textbox on form
 *
 * @returns !onSubmit - Form to input puzzle code
 * @returns onSubmit - NonogramProvider
 */
export const PlayGame = () => {
  const [submit, setSubmit] = useState<boolean>(false);
  const gameCode = useRef<HTMLInputElement>(null);
  const gameSolution = useRef<boolean[][]>([]);

  const handleSubmit = async (e: React.MouseEvent) => {
    let errorMsg = '';
    if (gameCode.current === null || gameCode.current === undefined || gameCode.current.value === '') {
      await fetch(`http://localhost:3001/puzzles/1`)
        .then((res) => res.json())
        .then((puzzle: Puzzle) => gameSolution.current = importPuzzle(puzzle.puzzleCode));
    } else {
      gameSolution.current = importPuzzle(gameCode.current.value);
    }

    if (!checkSolutionNotBlank(gameSolution.current)) {
      errorMsg += 'Invalid Code. Code entered results in a blank puzzle.\n';
    }
    if (!checkPuzzleRectangular(gameSolution.current)) {
      errorMsg += 'Invalid Code. Code entered results in an irregularly shaped puzzle.\n';
    }

    if (errorMsg === '') {
      setSubmit(true);
    } else {
      alert(errorMsg);
    }
  }

  return (
    <>
      {!submit ? (
        <form action='' id='enterGameCode'>
          <label htmlFor='gameCode'>Enter Code: </label>
          <input type='text' id='gameCode' data-testid={'gameCode'} name='gameCode' ref={gameCode} />
          <button type='button'
            id='submit'
            name='submit'
            onClick={(e) => {
              e.preventDefault();
              void handleSubmit(e);
            }}
          >Play Puzzle</button>
        </form>
      ) : (
        <PlayNonogramProvider puzzleSolution={gameSolution.current} />
      )}
    </>
  );
}