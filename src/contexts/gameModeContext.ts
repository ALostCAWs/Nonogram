/* ---- Imports Section */
import { createContext } from 'react';
// Constants
import { GAME_MODE_STATE } from 'constants/gameModeState';
/* End ---- */

export const GameModeContext = createContext<string>(GAME_MODE_STATE.NONE);