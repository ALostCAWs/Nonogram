/**
 * Obtain the boards' width from the puzzleCode & remove it & the separator char from the string
 * Use the boards' width to separate the remainder of the hash into strings of that length
 * Build puzzleSolution as a 2D array
 * Each newly-separated string in codeRow represents a row on the board, height / columns are not needed to generate the puzzleSolution
 *
 * @returns A 2D array of the puzzleSolution derived from the puzzleCode
 */
export const importPuzzle = (puzzleCode: string): boolean[][] => {
  //console.log(puzzleCode);

  const spaceIndex = puzzleCode.indexOf('|');
  const boardWidth = puzzleCode.slice(0, spaceIndex);
  //console.log(boardWidth);
  puzzleCode = puzzleCode.slice(spaceIndex + 1);

  const codeRow = puzzleCode.match(new RegExp(`.{1,${boardWidth}}`, 'g')) || [];

  const puzzleSolution: boolean[][] = [];
  for (let i = 0; i < codeRow.length; i++) {
    const rowSolution: boolean[] = [];
    const code = codeRow[i].split('');
    for (let i = 0; i < code.length; i++) {
      const fillable = code[i] === '1' ? true : false;
      rowSolution.push(fillable)
    }
    puzzleSolution.push(rowSolution);
  }
  return puzzleSolution;
}