export const gameImport = (gameHash) => {
  const gameSolution = JSON.parse(atob(gameHash));
  console.log(gameHash);
  console.log(gameSolution);
  return gameSolution;
}