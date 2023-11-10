/* ---- Imports Section */
// Functions
import { exportGame } from "../nonogram/gameImportExport/exportGame.js";
import { importGame } from "../nonogram/gameImportExport/importGame.js";
import { checkGameNotBlank, checkGameRectangular } from "../nonogram/boardDisplay/getBoardInfo.js";
/* End ---- */

const gameSolution5x5_NotBlank = [[true, true, true, true, true],
[false, true, true, false, false],
[false, true, false, true, false],
[false, true, true, false, false],
[false, true, false, false, false]];
const gameHash5x5_NotBlank = '5|1111101100010100110001000';

const gameSolution5x5_Blank = [[false, false, false, false, false],
[false, false, false, false, false],
[false, false, false, false, false],
[false, false, false, false, false],
[false, false, false, false, false]];
const gameHash5x5_Blank = '5|0000000000000000000000000';

const gameSolution5x5_Irregular_NotBlank = [[true, false, false, false, false],
[false, false, false, false, false],
[false, false, false, false, false],
[false, false, false, false, false],
[false, false, false, false]];
const gameHash5x5_Irregular_NotBlank = '5|100000000000000000000000';

const gameSolution5x5_Irregular_Blank = [[false, false, false, false, false],
[false, false, false, false, false],
[false, false, false, false, false],
[false, false, false, false, false],
[false, false, false, false]];
const gameHash5x5_Irregular_Blank = '5|000000000000000000000000';

it('exports the game as a string', () => {
  // Does not need to handle invalid exports
  // gameSolution is checked for validity prior to running the export function
  const result_GameHashNotBlank = exportGame(gameSolution5x5_NotBlank);
  expect(result_GameHashNotBlank).toEqual(gameHash5x5_NotBlank);
});

it('imports the gameHash string as an array', () => {
  // Needs to be able to handle valid & invalid imports
  // gameSolution arrays are used to validate the inputs, not the gameHash strings

  // Valid
  const result_GameSolutionNotBlank = importGame(gameHash5x5_NotBlank);
  expect(result_GameSolutionNotBlank).toEqual(gameSolution5x5_NotBlank);

  // Invalid - Blank
  const result_GameSolutionBlank = importGame(gameHash5x5_Blank);
  expect(result_GameSolutionBlank).toEqual(gameSolution5x5_Blank);

  // Invalid - Irregular
  const result_GameSolutionIrregularNotBlank = importGame(gameHash5x5_Irregular_NotBlank);
  expect(result_GameSolutionIrregularNotBlank).toEqual(gameSolution5x5_Irregular_NotBlank);

  const result_GameSolutionIrregularBlank = importGame(gameHash5x5_Irregular_Blank);
  expect(result_GameSolutionIrregularBlank).toEqual(gameSolution5x5_Irregular_Blank);
});

it('checks gameSolution arrays for validity', () => {
  // Valid - Both pass
  const result_GameSolutionNotBlank_NotBlank = checkGameNotBlank(gameSolution5x5_NotBlank);
  expect(result_GameSolutionNotBlank_NotBlank).toEqual(true);
  const result_GameSolutionNotBlank_Rectangular = checkGameRectangular(gameHash5x5_NotBlank);
  expect(result_GameSolutionNotBlank_Rectangular).toEqual(true);

  // Invalid - Blank - Not blank false, rectangular true
  const result_GameSolutionBlank_NotBlank = checkGameNotBlank(gameSolution5x5_Blank);
  expect(result_GameSolutionBlank_NotBlank).toEqual(false);
  const result_GameSolutionBlank_Rectangular = checkGameRectangular(gameHash5x5_Blank);
  expect(result_GameSolutionBlank_Rectangular).toEqual(true);

  // Invalid - Irregular - Not blank true, rectangular false
  const result_GameSolutionIrregularNotBlank_NotBlank = checkGameNotBlank(gameSolution5x5_Irregular_NotBlank);
  expect(result_GameSolutionIrregularNotBlank_NotBlank).toEqual(true);
  const result_GameSolutionIrregularNotBlank_Rectangular = checkGameRectangular(gameSolution5x5_Irregular_NotBlank);
  expect(result_GameSolutionIrregularNotBlank_Rectangular).toEqual(false);

  // Invalid - Irregular - Not blank false, rectangular false
  const result_GameSolutionIrregularBlank_NotBlank = checkGameNotBlank(gameSolution5x5_Irregular_Blank);
  expect(result_GameSolutionIrregularBlank_NotBlank).toEqual(false);
  const result_GameSolutionIrregularBlank_Rectangular = checkGameRectangular(gameSolution5x5_Irregular_Blank);
  expect(result_GameSolutionIrregularBlank_Rectangular).toEqual(false);
});