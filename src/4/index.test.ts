import { readFileSync, writeFileSync } from 'fs';
import { Coord, getNeighbours, isInBounds } from '../helpers';

describe('day 4', () => {
  const smallTestFilePath = __dirname + '/small-test-data.txt';
  const testFilePath = __dirname + '/test-data.txt';
  const realFilePath = __dirname + '/real-data.txt';
  const parseFile = (filePath: string) =>
    readFileSync(filePath, 'utf-8')
      .trim()
      .split('\n')
      .map((line) => line.trim());
  const realData = parseFile(realFilePath);
  const testData = parseFile(testFilePath);
  const smallTestData = parseFile(smallTestFilePath);

  const toGrid = (file: string[]) => file.map((line) => line.split(''));

  describe('part 1', () => {
    test('can parse file & grid', () => {
      expect(smallTestData).toHaveLength(5);

      const grid = toGrid(smallTestData);

      expect(grid).toHaveLength(5);
      grid.forEach((row) => {
        expect(row).toHaveLength(6);
      });
    });

    test('can find start squares', () => {
      const grid = toGrid(smallTestData);

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

    const xmasesToFile = (xmases: Coord[][]) => {
      const str = xmases
        .map((line) => line.map((c) => `${c.x},${c.y}`).join(' -> '))
        .join('\n');

      writeFileSync(__dirname + '/xmases.txt', str);
    };

    /**
     * this one allows XMAS to be written across any neighbours
     * that means xmas does not have to be in a straight line!
     *
     * I think that's wrong
     */
    describe.skip('v1', () => {
      const findXmasV1 = (grid: string[][], start: Coord) => {
        let xmases: Coord[][] = [[start]];

        for (let i = 0; i < 'XMAS'.length - 1; i++) {
          if (!xmases.length) {
            break;
          }

          const nextXmases: Coord[][] = [];

          while (xmases.length) {
            const coordList = xmases.pop();
            if (!coordList) {
              break;
            }

            const nextCoord = coordList[coordList.length - 1];
            const nextLetter = 'XMAS'[i + 1];
            const neighbours = getNeighbours(nextCoord);
            neighbours.forEach((c) => {
              if (!isInBounds(grid, c)) {
                return;
              }

              const letter = grid[c.y][c.x];
              if (letter === nextLetter) {
                nextXmases.push([...coordList, c]);
              }
            });
          }

          xmases = nextXmases;
        }

        return xmases;
      };

      test('can solve from one start square', () => {
        const grid = toGrid(testData);
        const coord = { x: 2, y: 0 };

        const xmases = findXmasV1(grid, coord);

        expect(xmases).toBe(3);
      });

      test('does v1 solve test data?', () => {
        const grid = toGrid(testData);

        const starts: Coord[] = [];
        for (let r = 0; r < grid.length; r++) {
          for (let c = 0; c < grid.length; c++) {
            const coord = { x: c, y: r };
            const cell = grid[r][c];
            if (cell === 'X') {
              starts.push(coord);
            }
          }
        }

        const tot: Coord[][] = [];
        starts.forEach((start) => {
          findXmasV1(grid, start).forEach((solution) => {
            tot.push(solution);
          });
        });

        xmasesToFile(tot);
        expect(tot).toHaveLength(18);
      });
    });

    type Search = {
      coords: Coord[];
      xDiff: number;
      yDiff: number;
    };

    describe('v2', () => {
      const xmasesToFileV2 = (searches: Search[]) => {
        const str = searches
          .map((s) =>
            [
              `diffs:(x:${s.xDiff}, y:${s.yDiff})`,
              'coords:',
              s.coords.map((c) => `${c.x},${c.y}`).join(' -> '),
            ].join(' ')
          )
          .join('\n');

        writeFileSync(__dirname + '/xmases.txt', str);
      };
      const findXmasV2 = (grid: string[][], start: Coord) => {
        const searches: Search[] = [];

        const neighbours = getNeighbours(start);
        neighbours.forEach((n) => {
          if (!isInBounds(grid, n)) {
            return;
          }

          const letter = grid[n.y][n.x];
          if (letter !== 'M') {
            return;
          }

          const xDiff = n.x - start.x;
          const yDiff = n.y - start.y;
          searches.push({
            coords: [start, n],
            xDiff,
            yDiff,
          });
        });

        searches.forEach((search) => {
          for (let i = search.coords.length; i < 'XMAS'.length; i++) {
            const currentPos = search.coords[i - 1];
            const currentLetter = 'XMAS'[i - 1];
            const nextLetter = 'XMAS'[i];
            if (!currentPos || currentLetter === 'S') {
              return;
            }

            const nextPos = {
              x: currentPos.x + search.xDiff,
              y: currentPos.y + search.yDiff,
            };
            const searchLetter = grid[nextPos.y]?.[nextPos.x];
            if (searchLetter === nextLetter) {
              search.coords.push(nextPos);
            }
          }
        });

        return searches;
      };

      test('can solve from one start square', () => {
        const grid = toGrid(smallTestData);
        const coord = { x: 2, y: 0 };

        const xmases = findXmasV2(grid, coord);

        xmasesToFileV2(xmases);

        expect(xmases).toHaveLength(1);
      });

      test('does v1 solve test data?', () => {
        const grid = toGrid(testData);

        const starts: Coord[] = [];
        for (let r = 0; r < grid.length; r++) {
          for (let c = 0; c < grid.length; c++) {
            const coord = { x: c, y: r };
            const cell = grid[r][c];
            if (cell === 'X') {
              starts.push(coord);
            }
          }
        }

        const tot: Search[] = [];
        starts.forEach((start) => {
          findXmasV2(grid, start).forEach((solution) => {
            if (solution.coords.length === 'XMAS'.length) {
              tot.push(solution);
            }
          });
        });

        xmasesToFileV2(tot);
        expect(tot).toHaveLength(18);
      });
    });
  });
});
