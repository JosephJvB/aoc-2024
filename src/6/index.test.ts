import { readFileSync, writeFileSync } from 'fs';
import { Coord, Direction, isInBounds } from '../helpers';

describe('day 6', () => {
  const testFilePath = __dirname + '/test-data.txt';
  const realFilePath = __dirname + '/real-data.txt';

  const parseFile = (filePath: string) => {
    const grid = readFileSync(filePath)
      .toString()
      .trim()
      .split('\n')
      .map((l) => l.split(''));

    return grid;
  };

  const testData = parseFile(testFilePath);
  const realData = parseFile(realFilePath);

  const findStart = (grid: string[][]) => {
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid.length; c++) {
        if (grid[r][c] === '^') {
          return { x: c, y: r };
        }
      }
    }
  };

  const moveGuard = (guard: Coord, direction: Direction) => {
    /**
     * doing a spread operator here caused a weird error
     * "Cannot find module '@swc/helpers/_/_object_spread'"
     */
    const moved = {
      x: guard.x,
      y: guard.y,
    };
    switch (direction) {
      case 'N':
        moved.y--;
        break;
      case 'E':
        moved.x++;
        break;
      case 'S':
        moved.y++;
        break;
      case 'W':
        moved.x--;
        break;
    }

    return moved;
  };

  const rotateGuard = (direction: Direction) => {
    switch (direction) {
      case 'N':
        return 'E';
      case 'E':
        return 'S';
      case 'S':
        return 'W';
      case 'W':
        return 'N';
    }
  };

  describe('part 1', () => {
    test('can find start in test data', () => {
      const result = findStart(testData);

      expect(result).toEqual({
        x: 4,
        y: 6,
      });
    });

    test('solve test data', () => {
      let guard = findStart(testData)!;
      let direction: Direction = 'N';

      const visited = new Set<string>();

      while (true) {
        visited.add(`${guard.x}x${guard.y}`);

        const nextPos = moveGuard(guard, direction);
        if (!isInBounds(testData, nextPos)) {
          break;
        }

        const cell = testData[nextPos.y][nextPos.x];

        if (cell === '#') {
          direction = rotateGuard(direction);
        } else {
          guard = nextPos;
        }
      }

      const clone = parseFile(testFilePath);
      for (let r = 0; r < clone.length; r++) {
        for (let c = 0; c < clone.length; c++) {
          const pos = `${c}x${r}`;
          if (visited.has(pos)) {
            clone[r][c] = 'X';
          }
        }
      }
      writeFileSync(
        __dirname + '/pos.txt',
        clone.map((r) => r.join('')).join('\n')
      );

      expect(visited.size).toBe(41);
    });

    test('can solve part 1', () => {
      let guard = findStart(realData)!;
      let direction: Direction = 'N';

      const visited = new Set<string>();

      while (true) {
        visited.add(`${guard.x}x${guard.y}`);

        const nextPos = moveGuard(guard, direction);
        if (!isInBounds(realData, nextPos)) {
          break;
        }

        const cell = realData[nextPos.y][nextPos.x];

        if (cell === '#') {
          direction = rotateGuard(direction);
        } else {
          guard = nextPos;
        }
      }

      expect(visited.size).toBeGreaterThan(41);

      console.log({
        day6part1: visited.size,
      });
    });
  });
});
