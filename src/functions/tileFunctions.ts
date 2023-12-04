// Hovering over a tile highlights it & its' corresponding column / row hints
export const hoverTile = (e: React.MouseEvent, rowIndex: number, colIndex: number): void => {
  const hoverRow = document.querySelector(`.rowInfo${rowIndex}`);
  const hoverCol = document.querySelector(`.colInfo${colIndex}`);

  if (hoverRow === null || hoverCol === null) {
    return;
  }
  if (e.type === 'mouseenter') {
    hoverRow.classList.add('hoverInfo');
    hoverCol.classList.add('hoverInfo');
  }
  if (e.type === 'mouseleave') {
    hoverRow.classList.remove('hoverInfo');
    hoverCol.classList.remove('hoverInfo');
  }
}