export const encodeGameHAsh = (gameSolution) => {
  let gameHash = btoa(JSON.stringify(gameSolution));
  return gameHash;
}