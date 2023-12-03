export const setTileColFillState = (currentPuzzle: string[][], colIndex: number, fill: string): void => {
  for (let i = 0; i < currentPuzzle.length; i++) {
    currentPuzzle[i][colIndex] = fill;
  }
}
export const setTileRowFillState = (currentPuzzle: string[][], rowIndex: number, fill: string): void => {
  for (let i = 0; i < currentPuzzle[0].length; i++) {
    currentPuzzle[rowIndex][i] = fill;
  }
}