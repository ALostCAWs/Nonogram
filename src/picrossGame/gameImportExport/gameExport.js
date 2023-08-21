export const encodeGameHAsh = (gameSolution) => {
  // First item is separated from the rest of the string with a pipe (|), this is the boards' width
  let gameHash = `${String(gameSolution[0].length)}|`;

  // Loop 2D gameSolution, adding on to create a simple string based on the arrays' info
  for (let i = 0; i < gameSolution.length; i++) {
    for (let j = 0; j < gameSolution[i].length; j++) {
      let hashItem = gameSolution[i][j] ? '1' : '0';
      gameHash += hashItem;
    }
  }
  return gameHash;
}