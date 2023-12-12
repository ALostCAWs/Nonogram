import { createContext } from 'react';

interface InfoTileFunctionality {
  setRowFill: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void,
  setColFill: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void,
}

export const InfoTileFunctionsContext = createContext<InfoTileFunctionality>({
  setRowFill: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
  setColFill: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
});