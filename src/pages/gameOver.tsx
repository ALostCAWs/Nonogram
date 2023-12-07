interface GameOverProps {
  resetPuzzle: () => void
}

/**
 * @returns Display game over message
 */
export const GameOver = ({ resetPuzzle }: GameOverProps) => {
  return (
    <div className='gameOver'>
      <div>
        <h2>Game Over</h2>
        <button type='button' className='button' onClick={resetPuzzle}>Retry</button>
      </div>
    </div>
  );
}