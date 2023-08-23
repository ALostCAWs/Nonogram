/* ---- Imports Section */
import React from 'react';
/* End ---- */

// Tiles are only aware of their fillState & coords.
// When they're clicked, they tell the picross provider their coords. & the game array is updated
export const Tile = ({ fill, rowIndex, colIndex, fillTile = () => {}, markTile = () => {}, hoverTile = () => {} }) => {
  return (
    <div className={`tile ${fill}`} onClick={e => fillTile(e, rowIndex, colIndex)} onContextMenu={e => markTile(e, rowIndex, colIndex)} onMouseEnter={e => hoverTile(e, rowIndex, colIndex)} onMouseLeave={e => hoverTile(e, rowIndex, colIndex)}></div>
  );
}