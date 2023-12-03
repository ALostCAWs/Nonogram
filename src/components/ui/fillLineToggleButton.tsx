/* ---- Imports Section */
import React from 'react';
/* End ---- */

interface FillLineToggleButtonProps {
  lineIndex: number
}

export const FillLineToggleButton = ({ lineIndex }: FillLineToggleButtonProps) => {
  return (
    <div data-testid={`toggle${lineIndex}`}>btn</div>
  );
};