import { TileState } from "interfaces/tileState"

export const convertTileStateLineToStringLine = (line: TileState[]): string[] => {
  const fillLine: string[] = [];
  for (let i = 0; i < line.length; i++) {
    fillLine.push(line[i].fill);
  }
  return fillLine;
}

export const convertTileStateMatrixToStringMatrix = (currentPuzzle: TileState[][]): string[][] => {
  const fillPuzzle: string[][] = [];
  for (let i = 0; i < currentPuzzle.length; i++) {
    fillPuzzle.push(convertTileStateLineToStringLine(currentPuzzle[i]));
  }
  return fillPuzzle;
}

export const convertStringLineToTileStateLine = (inputLine: string[]): TileState[] => {
  const outputLine: TileState[] = [];

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

export const convertStringMatrixToTileStateMatrix = (inputPuzzle: string[][]): TileState[][] => {
  const outputPuzzle: TileState[][] = [];

  for (let i = 0; i < inputPuzzle.length; i++) {
    outputPuzzle.push(convertStringLineToTileStateLine(inputPuzzle[i]));
  }
  return outputPuzzle;
}