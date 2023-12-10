import React, { createContext } from 'react';

export const SelectModeContext = createContext({
  selectMode: false,
  setSelectMode: (v: boolean) => { }
});