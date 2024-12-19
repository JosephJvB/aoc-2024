import { readFileSync } from 'fs';
import { Coord } from '../helpers';

describe('day 4', () => {
  const testFilePath = __dirname + '/test-data.txt';
  const realFilePath = __dirname + '/real-data.txt';
  const parseFile = (filePath: string) =>
    readFileSync(filePath, 'utf-8')
      .trim()
      .split('\n')
      .map((line) => line.trim());
  const realData = parseFile(realFilePath);
  const testData = parseFile(testFilePath);

  const toGrid = (file: string[]) => file.map((line) => line.split(''));

  const TARGET = 'XMAS';

  describe('part 1', () => {
    test('can parse file & grid', () => {
      expect(testData).toHaveLength(5);

      const grid = toGrid(testData);

      expect(grid).toHaveLength(5);
      grid.forEach((row) => {
        expect(row).toHaveLength(6);
      });
    });

    test('can find start squares', () => {
      const grid = toGrid(testData);

      let xCount = 0;
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid.length; c++) {
          // const coord = { x: c, y: r };
          const cell = grid[r][c];
          if (cell === 'X') {
            xCount++;
          }
        }
      }

      expect(xCount).toBe(4);
    });

    const findXmas = (grid: string[][], start: Coord) => {
      let letterIdx = 1;
    };

    // test('can solve from one start square', () => {
    //   const grid = toGrid(testData);
    //   const coord = { x: 2, y: 0 };
    // });
  });
});
