interface GameCompleteProps {
  lives: number,
  resetPuzzle: () => void
}

/**
 * @returns Display game completion message
 */
export const GameComplete = ({ lives, resetPuzzle }: GameCompleteProps) => {
  return (
    <div className='gameComplete'>
      <div>
        <h2>{`Puzzle solved with ${lives} lives remaining`}</h2>
        <button type='button' className='button' onClick={resetPuzzle}>Retry</button>
      </div>
    </div>
  );
}