export const importGame = (gameHash: string): boolean[][] => {
  console.log(gameHash);

  // Obtain the boards' width from the gameHash & remove it & the separator char from the string
  const spaceIndex = gameHash.indexOf('|');
  const boardWidth = gameHash.slice(0, spaceIndex);
  console.log(boardWidth);
  gameHash = gameHash.slice(spaceIndex + 1);

  // Use the boards' width to separate the remainder of the hash into strings of that length
  const hashRows = gameHash.match(new RegExp(`.{1,${boardWidth}}`, 'g')) || [];

  // Build gameSolution as a 2D array
  // Each newly-separated string in hashRows represents a row on the board, height / columns are not needed to generate the gameSolution
  let gameSolution: boolean[][] = [];
  for (let i = 0; i < hashRows.length; i++) {
    let rowSolution: boolean[] = [];
    let hashVal = hashRows[i].split('');
    for (let i = 0; i < hashVal.length; i++) {
      let fillable = hashVal[i] === '1' ? true : false;
      rowSolution.push(fillable)
    }
    gameSolution.push(rowSolution);
  }
  return gameSolution;
}