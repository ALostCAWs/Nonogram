interface LifeProps {
  tileSize: number
}

/**
 * Displays a life counter for the user to see how many lives remain
 *
 * @returns Div of the same dimensions as the Tiles
 */
export const Life = ({ tileSize }: LifeProps) => {
  return (
    <div data-testid={'life'} className='life' style={{ height: tileSize, width: tileSize }}></div>
  );
}