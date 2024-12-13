import { readFileSync } from 'fs';

describe('day 1', () => {
  const testFile = readFileSync(__dirname + '/test-data.txt')
    .toString()
    .trim();
  const realFile = readFileSync(__dirname + '/real-data.txt')
    .toString()
    .trim();

  it('should pass', () => {
    expect(1).toBe(1);
  });

  const getLists = (fileString: string) => {
    const left: number[] = [];
    const right: number[] = [];

    fileString.split('\n').forEach((line) => {
      const [l, r] = line.trim().split('   ');
      left.push(parseInt(l));
      right.push(parseInt(r));
    });

    return { left, right };
  };

  describe('part 1', () => {
    describe('tests', () => {
      test('can parse the lists', () => {
        const { left, right } = getLists(testFile);

        expect(left).toEqual([3, 4, 2, 1, 3, 3]);
        expect(right).toEqual([4, 3, 5, 3, 9, 3]);
      });

      test('can sort the lists', () => {
        const { left, right } = getLists(testFile);

        left.sort((a, b) => a - b);
        right.sort((a, b) => a - b);

        expect(left).toEqual([1, 2, 3, 3, 3, 4]);
        expect(right).toEqual([3, 3, 3, 4, 5, 9]);
      });

      test('can get diffs', () => {
        const { left, right } = getLists(testFile);

        left.sort((a, b) => a - b);
        right.sort((a, b) => a - b);

        let diff = 0;

        for (let i = 0; i < left.length; i++) {
          diff += Math.abs(left[i] - right[i]);
        }

        expect(diff).toBe(11);
      });
    });

    test('can solve part 1', () => {
      const { left, right } = getLists(realFile);

      left.sort((a, b) => a - b);
      right.sort((a, b) => a - b);

      let diff = 0;

      for (let i = 0; i < left.length; i++) {
        diff += Math.abs(left[i] - right[i]);
      }

      expect(diff).toBeGreaterThan(11);

      // console.log({ diff });
    });
  });

  describe('part 2', () => {
    describe('tests', () => {
      test('can solve the test data', () => {
        const { left, right } = getLists(testFile);

        const rightCounts: Record<number, number> = {};
        right.forEach((num) => {
          if (!rightCounts[num]) {
            rightCounts[num] = 0;
          }
          rightCounts[num]++;
        });

        let ans = 0;
        left.forEach((num) => {
          ans += num * (rightCounts[num] ?? 0);
        });

        expect(ans).toBe(31);
      });
    });

    test('can solve part 2', () => {
      const { left, right } = getLists(realFile);

      const rightCounts: Record<number, number> = {};
      right.forEach((num) => {
        if (!rightCounts[num]) {
          rightCounts[num] = 0;
        }
        rightCounts[num]++;
      });

      let ans = 0;
      left.forEach((num) => {
        ans += num * (rightCounts[num] ?? 0);
      });

      expect(ans).toBeGreaterThan(31);

      console.log({ ans });
    });
  });
});
