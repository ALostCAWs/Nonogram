import { useState, useRef, useEffect } from 'react';
import { GameModeContext } from 'contexts/gameModeContext';
import { SelectModeContext } from 'contexts/selectModeContext';
import { FillModeContext } from 'contexts/fillModeContext';
import { GAME_MODE_STATE } from 'constants/gameModeState';
import { PlayGame } from 'pages/playGame';
import { CreateNonogramProvider } from 'components/providers/createNonogramProvider';
import { importPuzzle } from 'functions/importPuzzle';
import { exportPuzzle } from 'functions/exportPuzzle';
import { getPuzzleByColumn } from 'functions/getPuzzleInfo';
import logo from './logo.svg';
import './App.css';

const puzzleSolution5x5 = [[true, true, true, true, true],
[false, true, true, false, false],
[false, true, false, true, false],
[false, true, true, false, false],
  [false, true, true, false, false]];

const gameSolution1 = [[true, true, true, true, true],
[false, true, true, false, false],
[false, true, false, true, false],
[false, true, true, false, false],
[false, true, false, false, false]];

const gameSolution2 = [[true, false, false, false, false],
[false, false, false, false, false],
[false, false, false, false, false],
[false, false, false, false, false],
[false, false, false, false, false]];

const gameSolution3 = [[false, true, true, false, true],
[false, true, true, false, false],
[false, true, false, true, false],
[false, true, true, false, false],
[false, true, false, false, false]];

export const App = () => {
  const [playPuzzle, setPlayPuzzle] = useState(false);
  const [createPuzzle, setCreatePuzzle] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  //const [fillMode, setFillMode] = useState(true);

  const boardHeight = useRef<HTMLSelectElement>(null);
  const boardWidth = useRef<HTMLSelectElement>(null);

  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

  const abortSelect = () => {
    // TODO: Remove selected styling
    setSelectMode(false);
    console.log('SelectMode Aborted.');
  }

  exportPuzzle(gameSolution1);
  exportPuzzle(gameSolution2);
  exportPuzzle(gameSolution3);
  return (
    <div className="App" onMouseUp={abortSelect}>
      {!playPuzzle && !createPuzzle && (
        <>
          <button type='button' className='playPuzzle button' onClick={() => setPlayPuzzle(true)}>Play</button>

          <select name="height" id="height" ref={boardHeight}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
          <select name="width" id="width" ref={boardWidth}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
          <button type='button' className='createPuzzle button'
            onClick={() => {
              setDimensions({ height: parseInt(boardHeight.current?.value ?? '0'), width: parseInt(boardWidth.current?.value ?? '0') })
              setCreatePuzzle(true)
            }}
          >Create</button>
        </>
      )}
      {playPuzzle && (
        <SelectModeContext.Provider value={{ selectMode, setSelectMode }}>
          <GameModeContext.Provider value={GAME_MODE_STATE.PLAY}>
            <PlayGame />
          </GameModeContext.Provider>
        </SelectModeContext.Provider>
      )}
      {createPuzzle && (
        <SelectModeContext.Provider value={{ selectMode, setSelectMode }}>
        <GameModeContext.Provider value={GAME_MODE_STATE.CREATE}>
            <CreateNonogramProvider boardHeight={dimensions.height} boardWidth={dimensions.width} />
        </GameModeContext.Provider>
        </SelectModeContext.Provider>
      )}
    </div>
  );
}

export default App;