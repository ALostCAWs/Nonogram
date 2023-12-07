/* ---- Imports Section */
import React, { createContext } from 'react';
// Constants
import { GAME_MODE_STATE } from 'constants/gameModeState';

export const GameModeContext = createContext<string>(GAME_MODE_STATE.NONE);