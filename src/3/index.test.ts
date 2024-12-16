import { readFileSync } from 'fs';

describe('day 3', () => {
  const realFilePath = __dirname + '/real-data.txt';
  const parseFile = (filePath: string) =>
    readFileSync(filePath, 'utf-8')
      .trim()
      .split('\n')
      .map((line) => line.trim());
  const realData = parseFile(realFilePath).join('');

  const multsRegex = new RegExp(/mul\(\d+,\d+\)/, 'g');

  describe('part 1', () => {
    const testData =
      'xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))';

    test('regex works', () => {
      const mults = testData.match(multsRegex)!;

      expect(mults).toHaveLength(4);
      expect(mults[0]).toBe('mul(2,4)');
      expect(mults[2]).toBe('mul(11,8)');
    });

    test('can solve test data', () => {
      let total = 0;

      testData.match(multsRegex)!.forEach((mult) => {
        const nums = mult.match(/\d+/g);
        expect(nums).toHaveLength(2);

        const [a, b] = nums!?.map((n) => parseInt(n));
        total += a * b;
      });

      expect(total).toBe(161);
    });

    test('can solve real data', () => {
      let total = 0;

      realData.match(multsRegex)!.forEach((mult) => {
        const nums = mult.match(/\d+/g);
        expect(nums).toHaveLength(2);

        const [a, b] = nums!?.map((n) => parseInt(n));
        total += a * b;
      });

      expect(total).toBeGreaterThan(161);
      console.log({
        part1Ans: total,
      });
    });
  });

  describe('part 2', () => {
    const testData = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;
    const doCmd = `do()`;
    const dontCmd = `don't()`;

    test('it can solve test data', () => {
      const mults = testData.match(multsRegex)!;

      expect(mults).toHaveLength(4);

      const toCalc: string[] = [];
      let found = 0;
      let isActive = true;
      let i = 0;
      while (found < mults.length && i < testData.length) {
        const next = mults[found];
        if (!isActive && testData.slice(i, i + doCmd.length) == doCmd) {
          isActive = true;
          i += doCmd.length;
          continue;
        }

        if (isActive && testData.slice(i, i + dontCmd.length) == dontCmd) {
          isActive = false;
          i += dontCmd.length;
          continue;
        }

        const nextSlice = testData.slice(i, i + next.length);
        if (nextSlice === next) {
          i += next.length;
          found++;
          if (isActive) {
            toCalc.push(next);
          }
          continue;
        }

        i++;
      }

      expect(toCalc).toHaveLength(2);

      let total = 0;

      toCalc.forEach((mult) => {
        const [a, b] = mult.match(/\d+/g)!.map((v) => parseInt(v));

        total += a * b;
      });

      expect(total).toBe(48);
    });

    test('it can solve real data', () => {
      const mults = realData.match(multsRegex)!;

      const toCalc: string[] = [];
      let found = 0;
      let isActive = true;
      let i = 0;

      while (found < mults.length && i < realData.length) {
        const next = mults[found];
        if (!isActive && realData.slice(i, i + doCmd.length) == doCmd) {
          isActive = true;
          i += doCmd.length;
          continue;
        }

        if (isActive && realData.slice(i, i + dontCmd.length) == dontCmd) {
          isActive = false;
          i += dontCmd.length;
          continue;
        }

        const nextSlice = realData.slice(i, i + next.length);
        if (nextSlice === next) {
          i += next.length;
          found++;
          if (isActive) {
            /**
             * could do the calculation here rather than adding to list
             */
            toCalc.push(next);
          }
          continue;
        }

        i++;
      }

      console.log({
        activeMults: toCalc.length,
      });

      let total = 0;

      toCalc.forEach((mult) => {
        const [a, b] = mult.match(/\d+/g)!.map((v) => parseInt(v));

        total += a * b;
      });

      expect(total).toBeGreaterThan(48);
      console.log({ part2Ans: total });
    });
  });
});
