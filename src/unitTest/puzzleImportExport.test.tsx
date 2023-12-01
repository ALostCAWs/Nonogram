/* ---- Imports Section */
// Functions
import { exportPuzzle } from "functions/exportPuzzle";
import { importPuzzle } from "functions/importPuzzle";
/* End ---- */

const puzzleSolution5x5_NotBlank = [[true, true, true, true, true],
[false, true, true, false, false],
[false, true, false, true, false],
[false, true, true, false, false],
[false, true, false, false, false]];
const puzzleCode5x5_NotBlank = '5|1111101100010100110001000';

it('exports the puzzle as a string', () => {
  // Does not need to handle invalid exports
  // puzzleSolution is checked for validity prior to running the export function
  const puzzleCodeNotBlank = exportPuzzle(puzzleSolution5x5_NotBlank);
  expect(puzzleCodeNotBlank).toEqual(puzzleCode5x5_NotBlank);
});

it('imports the puzzleCode string as an array', () => {
  // Needs to be able to handle valid & invalid imports
  // puzzleSolution arrays are used to validate the inputs, not the puzzleCode strings

  // Valid
  const puzzleSolutionNotBlank = importPuzzle(puzzleCode5x5_NotBlank);
  expect(puzzleSolutionNotBlank).toEqual(puzzleSolution5x5_NotBlank);

  // Invalid - Blank
  const puzzleSolution5x5_Blank = [[false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false]];
  const puzzleCode5x5_Blank = '5|0000000000000000000000000';
  const puzzleSolutionBlank = importPuzzle(puzzleCode5x5_Blank);
  expect(puzzleSolutionBlank).toEqual(puzzleSolution5x5_Blank);

  // Invalid - Irregular
  const puzzleSolution5x5_Irregular_NotBlank = [[true, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false]];
  const puzzleCode5x5_Irregular_NotBlank = '5|100000000000000000000000';
  const puzzleSolutionIrregularNotBlank = importPuzzle(puzzleCode5x5_Irregular_NotBlank);
  expect(puzzleSolutionIrregularNotBlank).toEqual(puzzleSolution5x5_Irregular_NotBlank);

  const puzzleSolution5x5_Irregular_Blank = [[false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false]];
  const puzzleCode5x5_Irregular_Blank = '5|000000000000000000000000';
  const puzzleSolutionIrregularBlank = importPuzzle(puzzleCode5x5_Irregular_Blank);
  expect(puzzleSolutionIrregularBlank).toEqual(puzzleSolution5x5_Irregular_Blank);
});