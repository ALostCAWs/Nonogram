export const exportPuzzle = (puzzleSolution: boolean[][]): string => {
  // First item is separated from the rest of the string with a pipe (|), this is the boards' width
  let puzzleCode = `${String(puzzleSolution[0].length)}|`;

  // Loop 2D puzzleSolution, adding on to create a simple string based on the arrays' info
  for (let i = 0; i < puzzleSolution.length; i++) {
    for (let j = 0; j < puzzleSolution[i].length; j++) {
      const codeItem = puzzleSolution[i][j] ? '1' : '0';
      puzzleCode += codeItem;
    }
  }
  //console.log(puzzleCode);
  return puzzleCode;
}