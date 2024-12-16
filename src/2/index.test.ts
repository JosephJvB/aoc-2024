import { readFileSync } from 'fs';

describe('day 2', () => {
  const testFilePath = __dirname + '/test-data.txt';
  const realFilePath = __dirname + '/real-data.txt';
  const parseFile = (filePath: string) =>
    readFileSync(filePath, 'utf-8')
      .trim()
      .split('\n')
      .map((line) => line.trim());

  const lineIsSafe = (line: number[]) => {
    let direction: -1 | 0 | 1 = 0;
    for (let i = 0; i < line.length - 1; i++) {
      const current = line[i];
      const next = line[i + 1];

      if (isInvalidPair([current, next], direction)) {
        return false;
      }

      direction = current < next ? 1 : -1;
    }

    return true;
  };

  const isInvalidPair = (
    [current, next]: [number, number],
    direction: -1 | 0 | 1
  ) => {
    if (direction !== 0) {
      if (direction == -1 && current < next) {
        // console.log('direction -1');
        return true;
      }
      if (direction == 1 && current > next) {
        // console.log('direction 1');
        return true;
      }
    }

    const diff = Math.abs(next - current);
    if (diff < 1 || diff > 3) {
      // console.log('diff');
      return true;
    }

    return false;
  };

  test('it can parse test file', () => {
    const lines = parseFile(testFilePath);
    expect(lines).toHaveLength(6);
  });

  describe('part 1', () => {
    describe('test data', () => {
      test('it can check if a line is safe', () => {
        const line = [7, 6, 4, 2, 1];

        expect(lineIsSafe(line)).toBe(true);
      });

      test('it can pass test data', () => {
        const lines = parseFile(testFilePath).map((line) =>
          line.split(' ').map((n) => parseInt(n))
        );

        const safeLines = lines.filter((line) => lineIsSafe(line)).length;

        expect(safeLines).toBe(2);
      });
    });

    test('it can find safe lines in real data', () => {
      const lines = parseFile(realFilePath).map((line) =>
        line.split(' ').map((n) => parseInt(n))
      );

      const safeLines = lines.filter((line) => lineIsSafe(line)).length;

      expect(safeLines).toBeGreaterThan(2);

      console.log({ part1SafeLines: safeLines });
    });
  });

  describe('part 2', () => {
    // [[7, 6, 4, 2, 1], [1, 2, 7, 8, 9], [9, 7, 6, 2, 1], [8, 6, 4, 4, 1], [1, 3, 6, 7, 9]]
    test('can eval 2, 7 as unsafe', () => {
      const result = isInvalidPair([2, 7], 0);

      expect(result).toBe(true);
    });

    /**
     * 1 lvl backtracking (kinda)
     *
     * added the nextnext check. yuck. Seems to solve last pair tho?
     */
    const evaluateLine = (line: number[]) => {
      let direction: -1 | 0 | 1 = 0;

      for (let i = 0; i < line.length - 1; i++) {
        const current = line[i];
        const next = line[i + 1];

        const badPair = isInvalidPair([current, next], direction);
        if (badPair) {
          const prev = line[i - 1];
          const prevIsBad =
            !isNaN(prev) &&
            !isNaN(line[i + 2]) &&
            isInvalidPair([prev, next], direction);
          if (prevIsBad) {
            return false;
          }
        }
      }

      return true;
    };

    describe.skip('evalLine1', () => {
      test('[1, 2, 7, 8, 9] is unsafe', () => {
        const line = [1, 2, 7, 8, 9];

        const result = evaluateLine(line);

        expect(result).toBe(false);
      });

      test('can solve test data', () => {
        const lines = parseFile(testFilePath).map((line) =>
          line.split(' ').map((n) => parseInt(n))
        );

        const safeLines = lines.filter((line) => evaluateLine(line));

        expect(safeLines).toHaveLength(4);
        expect(safeLines).toEqual([
          [7, 6, 4, 2, 1],
          [1, 3, 2, 4, 5],
          [8, 6, 4, 4, 1],
          [1, 3, 6, 7, 9],
        ]);
      });

      test.skip('eval [28, 31, 34, 35, 38, 39, 43] as safe', () => {
        const input = [28, 31, 34, 35, 38, 39, 43];

        const result = evaluateLine(input);

        expect(result).toBe(true);
      });
    });

    const evaluateLine2 = (line: number[]) => {
      let direction: -1 | 0 | 1 = 0;

      let foundBad = false;
      let idx = 0;
      let pair = [line[0], line[1]] as [number, number];
      do {
        const badPair = isInvalidPair(pair, direction);
        if (badPair && foundBad) {
          return false;
        }

        idx++;
        pair = [line[idx], line[idx + 1]] as [number, number];

        if (badPair) {
          foundBad = true;
          // don't move left cursor fwd && don't update direction
          pair[0] = line[idx - 1];
        } else {
          foundBad = false;
          const [current, next] = pair;
          direction = current < next ? 1 : -1;
        }
      } while (idx < line.length - 1);

      return true;
    };

    describe.skip('evalLine2', () => {
      test('[1, 2, 7, 8, 9] is unsafe', () => {
        const line = [1, 2, 7, 8, 9];

        const result = evaluateLine2(line);

        expect(result).toBe(false);
      });

      test('can solve test data', () => {
        const lines = parseFile(testFilePath).map((line) =>
          line.split(' ').map((n) => parseInt(n))
        );

        const safeLines = lines.filter((line) => evaluateLine2(line));

        expect(safeLines).toHaveLength(4);
        expect(safeLines).toEqual([
          [7, 6, 4, 2, 1],
          [1, 3, 2, 4, 5],
          [8, 6, 4, 4, 1],
          [1, 3, 6, 7, 9],
        ]);
      });

      test('can handle invalid first pair', () => {
        const line = [1, 10, 11, 12, 13];

        const result = evaluateLine2(line);

        expect(result).toBe(true);
      });
    });

    test.skip('both handle [28, 31, 34, 35, 38, 39, 43] the same', () => {
      const input = [28, 31, 34, 35, 38, 39, 43];

      const res1 = evaluateLine(input);
      const res2 = evaluateLine2(input);

      expect(res1).toBe(true); // failing. I think evaluateLine is not handling last pair properly
      expect(res2).toBe(true);
      expect(res1).toBe(res2);
    });

    test.skip('both methods can solve part 2', () => {
      const lines = parseFile(realFilePath).map((line) =>
        line.split(' ').map((n) => parseInt(n))
      );

      const safeLines1 = lines.filter((line) => evaluateLine(line));
      const safeLines2 = lines.filter((line) => evaluateLine2(line));

      // [28, 31, 34, 35, 38, 39, 43]
      // 28 31 34 35 38 39 43
      for (let i = 0; i < safeLines1.length; i++) {
        const from1 = safeLines1[i];
        const from2 = safeLines2[i];

        // expect(from1).toEqual(from2);
      }

      /**
       * failed
       * 1 === 490 safe lines
       * 2 === 458 safe lines
       *
       * but who is right and who is wrong?
       * both are wrong! as it happens
       */
      expect(safeLines2).toHaveLength(safeLines1.length);
      expect(safeLines2).toEqual(safeLines1);
    });

    test.skip('eval 2 can solve part 2', () => {
      const lines = parseFile(realFilePath).map((line) =>
        line.split(' ').map((n) => parseInt(n))
      );

      const safeLines = lines.filter((line) => evaluateLine2(line));

      /**
       * submitted 458, too high
       */
      expect(safeLines.length).toBeLessThan(458);

      console.log({
        part2SafeLines: safeLines.length,
      });
    });

    const evalLine3 = (line: number[]) => {
      let invalidPairs = 0;
      let prevDirection: -1 | 0 | 1 = 0;
      let direction: -1 | 0 | 1 = 0;

      for (let i = 0; i < line.length - 1; i++) {
        const left = line[i];
        const right = line[i + 1];

        const isBad = isInvalidPair([left, right], direction);
        if (!isBad) {
          prevDirection = direction;
          direction = left < right ? 1 : -1;
          invalidPairs = 0;
          continue;
        }

        // [2, 1, 2, 3, 4, 5, 6]
        invalidPairs++;
        // remove left number
        const prevLeft = line[i - 1];
        if (
          !isNaN(prevLeft) &&
          isInvalidPair([prevLeft, right], prevDirection)
        ) {
          invalidPairs++;
        }
        const nextRight = line[i + 2];
        if (!isNaN(nextRight) && isInvalidPair([left, nextRight], direction)) {
          invalidPairs++;
        }

        if (invalidPairs === 3) {
          return false;
        }
      }

      return true;
    };

    describe.skip('eval3', () => {
      test('can solve test data', () => {
        const lines = parseFile(testFilePath).map((l) =>
          l.split(' ').map((n) => parseInt(n))
        );

        const safeLines = lines.filter((l) => evalLine3(l));

        expect(safeLines).toHaveLength(4);
      });

      test.only('can remove first item', () => {
        const line = [2, 1, 2, 3, 4, 5, 6];

        const result = evalLine3(line);

        expect(result).toBe(true);
      });

      test.skip('can solve real data', () => {
        const lines = parseFile(realFilePath).map((l) =>
          l.split(' ').map((n) => parseInt(n))
        );

        const safeLines = lines.filter((l) => evalLine3(l)).length;

        expect(safeLines).toBeGreaterThan(4);
        expect(safeLines).toBeLessThan(458);
        expect(safeLines).toBeGreaterThan(280); // dammit

        // console.log({
        //   part2SafeLines: safeLines,
        // });
      });
    });

    const evalLine4 = (line: number[]) => {
      if (lineIsSafe(line)) {
        return true;
      }

      /**
       * need to find a number to remove to make the line safe
       * this is brute force.
       * I'm sure there's a smarter way to find a bad pair, then backtrack removing numbers to find a safe combo.
       */

      for (let i = 0; i < line.length; i++) {
        const copy = [...line];
        copy.splice(i, 1);
        if (lineIsSafe(copy)) {
          return true;
        }
      }

      return false;
    };

    describe('evalLine4', () => {
      test('can solve test data', () => {
        const lines = parseFile(testFilePath).map((l) =>
          l.split(' ').map((n) => parseInt(n))
        );

        const safeLines = lines.filter((l) => evalLine4(l));

        expect(safeLines).toHaveLength(4);
      });

      test('can solve real data', () => {
        const lines = parseFile(realFilePath).map((l) =>
          l.split(' ').map((n) => parseInt(n))
        );

        const safeLines = lines.filter((l) => evalLine4(l)).length;

        expect(safeLines).toBeGreaterThan(4);
        expect(safeLines).toBeLessThan(458);
        expect(safeLines).toBeGreaterThan(280);

        console.log({
          part2SafeLines: safeLines,
        });
      });
    });
  });
});
