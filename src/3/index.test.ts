import { readFileSync } from 'fs';

describe('day 3', () => {
  const realFilePath = __dirname + '/real-data.txt';
  const parseFile = (filePath: string) =>
    readFileSync(filePath, 'utf-8')
      .trim()
      .split('\n')
      .map((line) => line.trim());
  const realData = parseFile(realFilePath);

  describe('part 1', () => {
    const testData =
      'xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))';

    const regex = new RegExp(/mul\(\d+,\d+\)/, 'g');

    test('regex works', () => {
      const mults = testData.match(regex)!;

      expect(mults).toHaveLength(4);
      expect(mults[0]).toBe('mul(2,4)');
      expect(mults[2]).toBe('mul(11,8)');
    });

    test('can solve test data', () => {
      let total = 0;

      testData.match(regex)!.forEach((mult) => {
        const nums = mult.match(/\d+/g);
        expect(nums).toHaveLength(2);

        const [a, b] = nums!?.map((n) => parseInt(n));
        total += a * b;
      });

      expect(total).toBe(161);
    });

    test('can solve real data', () => {
      let total = 0;

      realData.forEach((line) => {
        line.match(regex)!.forEach((mult) => {
          const nums = mult.match(/\d+/g);
          expect(nums).toHaveLength(2);

          const [a, b] = nums!?.map((n) => parseInt(n));
          total += a * b;
        });
      });

      expect(total).toBeGreaterThan(161);
      console.log({
        part1Ans: total,
      });
    });
  });
});
