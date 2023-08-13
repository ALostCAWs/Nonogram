/* ---- Get Column */
export const GetColumn = (inputGame, colIndex) => {
  let column = [];
  for (let i = 0; i < inputGame.length; i++) {
    column.push(inputGame[i][colIndex]);
  }
  return column;
}