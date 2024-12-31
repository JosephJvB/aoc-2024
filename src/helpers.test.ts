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

  describe('all combos', () => {
    // https://stackoverflow.com/questions/71878018/javascript-all-possible-combinations-from-single-array-every-order
    const getAllCombos = <T>(list: T[]) => {
      let combos: T[][] = [[]];

      /**
       * every number
       */
      for (const num of list) {
        const temp = [];

        /**
         * every temp list
         */
        for (const combo of combos) {
          /**
           * every number again
           */
          for (let i = 0; i <= combo.length; i++) {
            const newArr = combo.slice(0);
            newArr.splice(i, 0, num);
            temp.push(newArr);
          }
        }

        combos = temp;
      }

      return combos;
    };

    test('can solve 1, 2, 3', () => {
      const x = [1, 2, 3];
      /**
       * 1, 2, 3
       * 1, 3, 2
       * 2, 1, 3
       * 2, 3, 1
       * 3, 1, 2
       * 3, 2, 1
       */

      const result = getAllCombos(x);

      expect(result).toHaveLength(6);
    });

    test('can solve 1, 2, 3, 4', () => {
      const x = [1, 2, 3, 4];
      /**
       * 1, 2, 3, 4
       * 1, 2, 4, 3
       * 1, 3, 2, 4
       * 1, 3, 4, 2
       * 1, 4, 2, 3
       * 1, 4, 3, 2
       * ...
       */

      const result = getAllCombos(x);

      expect(result).toHaveLength(24);
    });
  });
});
