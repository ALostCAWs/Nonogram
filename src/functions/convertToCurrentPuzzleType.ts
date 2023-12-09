import { CurrentPuzzle } from "interfaces/currentPuzzle"

export const convertLineToCurrentPuzzleType = (inputLine: string[]): CurrentPuzzle[] => {
  const outputLine: CurrentPuzzle[] = [];

  for (let i = 0; i < inputLine.length; i++) {
    const fill = inputLine[i];
    const tile = {
      fill: fill,
      selected: false
    }
    outputLine.push(tile);
  }
  return outputLine;
}

export const convertPuzzleToCurrentPuzzleType = (inputPuzzle: string[][]): CurrentPuzzle[][] => {
  const outputPuzzle: CurrentPuzzle[][] = [];

  for (let i = 0; i < inputPuzzle.length; i++) {
    outputPuzzle.push(convertLineToCurrentPuzzleType(inputPuzzle[i]));
  }
  return outputPuzzle;
}