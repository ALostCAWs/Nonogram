export const gameImport = (gameHash) => {
  const gameSolution = JSON.parse(gameHash);
  console.log(gameHash);
  console.log(gameSolution);
  return gameSolution;
}