/* ---- Imports Section */
import React, { createContext } from 'react';
// Constants
import { gameModeState } from 'constants/gameModeState';

export const GameModeContext = createContext<string>(gameModeState.none);