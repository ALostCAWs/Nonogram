export const gameExport = (gameSolution) => {
  let gameHash = btoa(JSON.stringify(gameSolution));
  return gameHash;
}