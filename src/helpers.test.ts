import { getNeighbours, isInBounds } from './helpers';

describe('helpers', () => {
  describe('getNeighbours', () => {
    test('returns unique list of 8', () => {
      const coords = getNeighbours({ x: 0, y: 0 });

      expect(coords).toHaveLength(8);

      const unique = new Set();
      coords.forEach((c) => unique.add(JSON.stringify(c)));

      expect(unique.size).toBe(8);
    });
  });

  describe('isInBounds', () => {
    const grid: number[][] = [];
    for (let i = 0; i < 5; i++) {
      const row = [];
      for (let j = 0; j < 6; j++) {
        row.push(0);
      }
      grid.push(row);
    }

    test('y too low', () => {
      const coord = { x: 0, y: -1 };

      const result = isInBounds(grid, coord);

      expect(result).toBe(false);
    });

    test('y too high', () => {
      const coord = { x: 0, y: 5 };

      const result = isInBounds(grid, coord);

      expect(result).toBe(false);
    });

    test('x too low', () => {
      const coord = { x: -1, y: 0 };

      const result = isInBounds(grid, coord);

      expect(result).toBe(false);
    });

    test('x too high', () => {
      const coord = { x: 6, y: 0 };

      const result = isInBounds(grid, coord);

      expect(result).toBe(false);
    });

    test('coords in bounds', () => {
      grid.forEach((r, y) => {
        r.forEach((_, x) => {
          const result = isInBounds(grid, { x, y });
          expect(result).toBe(true);
        });
      });
    });
  });
});
