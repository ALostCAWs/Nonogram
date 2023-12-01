export const importPuzzle = (puzzleCode: string): boolean[][] => {
  console.log(puzzleCode);

  // Obtain the boards' width from the puzzleCode & remove it & the separator char from the string
  const spaceIndex = puzzleCode.indexOf('|');
  const boardWidth = puzzleCode.slice(0, spaceIndex);
  console.log(boardWidth);
  puzzleCode = puzzleCode.slice(spaceIndex + 1);

  // Use the boards' width to separate the remainder of the hash into strings of that length
  const codeRow = puzzleCode.match(new RegExp(`.{1,${boardWidth}}`, 'g')) || [];

  // Build puzzleSolution as a 2D array
  // Each newly-separated string in codeRow represents a row on the board, height / columns are not needed to generate the puzzleSolution
  let puzzleSolution: boolean[][] = [];
  for (let i = 0; i < codeRow.length; i++) {
    let rowSolution: boolean[] = [];
    let code = codeRow[i].split('');
    for (let i = 0; i < code.length; i++) {
      let fillable = code[i] === '1' ? true : false;
      rowSolution.push(fillable)
    }
    puzzleSolution.push(rowSolution);
  }
  return puzzleSolution;
}