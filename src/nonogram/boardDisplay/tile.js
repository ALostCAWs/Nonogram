/* ---- Imports Section */
import React, { useContext } from 'react';
import { FillModeContext } from '../playGame/nonogramProvider.js'
/* End ---- */

// Tiles are only aware of their fillState & coords.
// When they're clicked, they tell the nonogram provider their coords. & the game array is updated
export const Tile = ({ fill, rowIndex, colIndex, tileSize, fillTile = () => { }, markTile = () => { }, hoverTile = () => { } }) => {
  // Set fillMode to true if null ( handle create mode being fill-only with no FillModeContext )
  const fillMode = useContext(FillModeContext) ?? true;

  return (
    <>
      {fillMode ? (
        <div data-testid={`tile${rowIndex}-${colIndex}`} className={`tile ${fill}`} style={{ height: `${tileSize}px`, width: `${tileSize}px` }} onClick={e => fillTile(e, rowIndex, colIndex)} onMouseEnter={e => hoverTile(e, rowIndex, colIndex)} onMouseLeave={e => hoverTile(e, rowIndex, colIndex)}></div>
      ) : (
        <div className={`tile ${fill}`} style={{ height: `${tileSize}px`, width: `${tileSize}px` }} onClick={e => markTile(e, rowIndex, colIndex)} onMouseEnter={e => hoverTile(e, rowIndex, colIndex)} onMouseLeave={e => hoverTile(e, rowIndex, colIndex)}></div>
      )}
    </>
  );
}