import React, { useContext } from 'react';
import { SelectModeContext } from 'contexts/selectModeContext';
import { FillModeContext } from 'contexts/fillModeContext';

interface TileProps {
  fill: string,
  selected: boolean,
  rowIndex: number,
  colIndex: number,
  tileSize: number,
  setFirstSelectTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void,
  setLastSelectTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void,
  deselectTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void,
  fillTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void,
  markTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void,
  hoverTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void,
}

/**
 * Displays clickable Tiles for the user to interact with
 * The class of the tile depends on the fill ( it's FILL_STATE stored in currentPuzzle ), this determines its' appearance
 *
 * Tiles are only aware of their fillState & coords.
 * When they're clicked, they tell the nonogram provider their coords. & the puzzle array is updated
 *
 * The Tiles run functions onClick, onMouseEnter, & onMouseLeave
 * Set fillMode to true if null ( handle create mode being fill-only with no FillModeContext )
 * onClick function depends on the FillModeContext
 * FillModeContext == true - onClick calls fillTile
 * FillModeContext == false - onClick calls markTile
 *
 * @returns Div with a class based on that Tiles' fill stored in the currentPuzzle array
 */
export const Tile = ({ fill, selected, rowIndex, colIndex, tileSize, setFirstSelectTile, setLastSelectTile, deselectTile, fillTile, markTile, hoverTile }: TileProps) => {
  const fillMode = useContext(FillModeContext);
  const { selectMode, setSelectMode } = useContext(SelectModeContext);

  return (
    <>
      {fillMode ? (
        <div data-testid={`tile${rowIndex}-${colIndex}`}
          className={selected ? (`tile ${fill} selected`) : (`tile ${fill}`)}
          style={{
            height: `${tileSize}px`,
            width: `${tileSize}px`
          }}
          onMouseDown={e => {
            e.preventDefault()
            setSelectMode(true)
            setFirstSelectTile(e, rowIndex, colIndex)
          }}
          onMouseUp={e => {
            fillTile(e, rowIndex, colIndex)
          }}
          onMouseEnter={selectMode ? (
            e => {
              hoverTile(e, rowIndex, colIndex)
              setLastSelectTile(e, rowIndex, colIndex)
            }
          ) : (
            e => { hoverTile(e, rowIndex, colIndex) }
          )}
          onMouseLeave={e => { hoverTile(e, rowIndex, colIndex) }}
        ></div>
      ) : (
          <div data-testid={`tile${rowIndex}-${colIndex}`}
            className={selected ? (`tile ${fill} selected`) : (`tile ${fill}`)}
            style={{
              height: `${tileSize}px`,
              width: `${tileSize}px`
            }}
            onMouseDown={e => {
              e.preventDefault()
              setSelectMode(true)
              setFirstSelectTile(e, rowIndex, colIndex)
            }}
            onMouseUp={e => {
              markTile(e, rowIndex, colIndex)
            }}
            onMouseEnter={selectMode ? (
              e => {
                hoverTile(e, rowIndex, colIndex)
                setLastSelectTile(e, rowIndex, colIndex)
              }
            ) : (
              e => { hoverTile(e, rowIndex, colIndex) }
            )}
            onMouseLeave={e => { hoverTile(e, rowIndex, colIndex) }}
          ></div>
      )}
    </>
  );
}