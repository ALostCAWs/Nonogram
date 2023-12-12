import { createContext } from 'react';

interface TileFunctionality {
  setFirstSelectTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void,
  setLastSelectTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void,
  fillTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void,
  markTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void,
  hoverTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void,
}

export const TileFunctionsContext = createContext<TileFunctionality>({
  setFirstSelectTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
  setLastSelectTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
  fillTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
  markTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
  hoverTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
});