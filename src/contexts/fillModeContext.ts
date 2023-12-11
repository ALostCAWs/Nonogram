import { createContext } from 'react';

export const FillModeContext = createContext({
  fillMode: true,
  setFillMode: (v: boolean) => { }
});