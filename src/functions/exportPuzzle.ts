/**
 * First item is separated from the rest of the string with a pipe (|), this is the boards' width
 * Loop 2D puzzleSolution, adding on to create a simple string based on the arrays' info
 *
 * @returns A string consisting of 1s & 0s representing the puzzleSolutions' true & false states
 */
export const exportPuzzle = (puzzleSolution: boolean[][]): string => {
  let puzzleCode = `${String(puzzleSolution[0].length)}|`;

  for (let i = 0; i < puzzleSolution.length; i++) {
    for (let j = 0; j < puzzleSolution[i].length; j++) {
      const codeItem = puzzleSolution[i][j] ? '1' : '0';
      puzzleCode += codeItem;
    }
  }
  return puzzleCode;
}