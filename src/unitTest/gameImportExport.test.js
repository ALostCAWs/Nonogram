import { exportGame } from "../nonogram/gameImportExport/exportGame.js";
import { importGame } from "../nonogram/gameImportExport/importGame.js";

const gameSolution = [[true, true, true, true, true],
[false, true, true, false, false],
[false, true, false, true, false],
[false, true, true, false, false],
[false, true, false, false, false]];
const gameHash = '5|1111101100010100110001000';

it('exports the game', () => {
  const result = exportGame(gameSolution);
  expect(result).toEqual(gameHash);
});

it('imports the game', () => {
  const result = importGame(gameHash);
  expect(result).toEqual(gameSolution);
});