import { readFileSync } from 'fs';

describe('day 5', () => {
  const testFilePath = __dirname + '/test-data.txt';
  const realFilePath = __dirname + '/real-data.txt';
  const parseFile = (filePath: string) => {
    const [rules, updates] = readFileSync(filePath, 'utf-8')
      .trim()
      .split('\n\n')
      .map((section) => section.split('\n'));

    return {
      rules: rules.map((line) =>
        line
          .trim()
          .split('|')
          .map((n) => parseInt(n))
      ) as Array<[number, number]>,
      updates: updates.map((line) =>
        line
          .trim()
          .split(',')
          .map((n) => parseInt(n))
      ),
    };
  };

  const testData = parseFile(testFilePath);
  const realData = parseFile(realFilePath);

  type RuleSet = {
    before: Record<number, Set<number>>;
    after: Record<number, Set<number>>;
  };
  const createRuleSet = (rules: Array<[number, number]>) => {
    const ruleset: RuleSet = {
      before: {},
      after: {},
    };

    rules.forEach(([x, y]) => {
      if (!ruleset.before[x]) {
        ruleset.before[x] = new Set();
      }
      if (!ruleset.after[y]) {
        ruleset.after[y] = new Set();
      }

      ruleset.before[x].add(y);
      ruleset.after[y].add(x);
    });

    return ruleset;
  };

  const testRuleSet = createRuleSet(testData.rules);
  const realRuleSet = createRuleSet(realData.rules);

  const isValidUpdate = (ruleSet: RuleSet, update: number[]) => {
    const checked: number[] = [];
    const toCheck = update.slice(0);

    while (toCheck.length > 0) {
      const u = toCheck.shift()!;

      const before = ruleSet.before[u];
      const beforeInvalid = before && checked.find((c) => before.has(c));
      if (beforeInvalid) {
        // console.log('beforeInvalid', { u });
        return false;
      }

      const after = ruleSet.after[u];
      const afterInvalid = after && toCheck.find((c) => after.has(c));
      if (afterInvalid) {
        // console.log('afterInvalid', { u });
        return false;
      }

      checked.push(u);
    }

    return true;
  };

  describe('part 1', () => {
    test('it can parse test data', () => {
      expect(testData.rules).toHaveLength(21);

      testData.rules.forEach((rule) => {
        expect(rule).toHaveLength(2);

        rule.forEach((v) => {
          expect(isNaN(v)).toBe(false);
          expect(v).toBeGreaterThan(0);
        });
      });

      expect(testData.updates).toHaveLength(6);
      expect(testData.updates[0]).toHaveLength(5);
      expect(testData.updates[1]).toHaveLength(5);
      expect(testData.updates[2]).toHaveLength(3);
      expect(testData.updates[3]).toHaveLength(5);
      expect(testData.updates[4]).toHaveLength(3);
      expect(testData.updates[5]).toHaveLength(5);
    });

    test('solves update 1', () => {
      const input = testData.updates[0];

      const result = isValidUpdate(testRuleSet, input);

      expect(result).toBe(true);
    });

    test('finds only valid updates', () => {
      const validUpdates: number[][] = [];

      testData.updates.forEach((update) => {
        if (isValidUpdate(testRuleSet, update)) {
          validUpdates.push(update);
        }
      });

      expect(validUpdates).toHaveLength(3);
      expect(validUpdates[0]).toBe(testData.updates[0]);
      expect(validUpdates[1]).toBe(testData.updates[1]);
      expect(validUpdates[2]).toBe(testData.updates[2]);
    });

    test('solves part 1 test data', () => {
      let tot = 0;

      testData.updates.forEach((update) => {
        if (!isValidUpdate(testRuleSet, update)) {
          return;
        }

        const middleIdx = (update.length - 1) / 2;
        tot += update[middleIdx];
      });

      expect(tot).toBe(143);
    });

    test('it can solve part 1 real data', () => {
      let tot = 0;

      realData.updates.forEach((update) => {
        if (!isValidUpdate(realRuleSet, update)) {
          return;
        }

        const middleIdx = (update.length - 1) / 2;
        tot += update[middleIdx];
      });

      expect(tot).toBeGreaterThan(143);

      // console.log({ part1: tot });
    });
  });

  describe('part 2', () => {
    /**
     * if is invalid
     * find invalid index
     * try to rehome the invalid number from start
     */
    const findInvalidIndex = (ruleSet: RuleSet, update: number[]) => {
      const checked: number[] = [];
      const toCheck = update.slice(0);

      let idx = 0;
      while (toCheck.length > 0) {
        const u = toCheck.shift()!;

        const before = ruleSet.before[u];
        const beforeInvalid = before && checked.find((c) => before.has(c));
        if (beforeInvalid) {
          // console.log('beforeInvalid', { u });
          return idx;
        }

        const after = ruleSet.after[u];
        const afterInvalid = after && toCheck.find((c) => after.has(c));
        if (afterInvalid) {
          // console.log('afterInvalid', { u });
          return idx;
        }

        checked.push(u);
        idx++;
      }

      return -1;
    };

    test('it can find invalid index for 75,97,47,61,53', () => {
      const input = [75, 97, 47, 61, 53];

      const invalidIndex = findInvalidIndex(testRuleSet, input);

      expect(invalidIndex).toBe(0);
    });

    test('it can find invalid index for 97,13,75,29,47', () => {
      const input = [97, 13, 75, 29, 47];

      const invalidIndex = findInvalidIndex(testRuleSet, input);

      expect(invalidIndex).toBe(1);
    });

    const rehomeInvalidIndex = (
      ruleSet: RuleSet,
      update: number[],
      invalidIndex: number
    ) => {
      const invalidNumber = update[invalidIndex];
      const withoutInvalid = update.slice(0);
      withoutInvalid.splice(invalidIndex, 1);

      for (let i = 0; i < update.length; i++) {
        if (i === invalidIndex) {
          continue;
        }

        const clone = withoutInvalid.slice(0);
        (clone.splice as any)(i, 0, invalidNumber);

        const nextInvalidIndex = findInvalidIndex(ruleSet, clone);
        /**
         * fixed
         */
        if (nextInvalidIndex === -1) {
          return clone;
        }
        /**
         * OOPS
         */
        if (nextInvalidIndex === invalidIndex) {
          throw new Error(
            `couldnt place idx ${invalidIndex} in list ${update}`
          );
        }
        /**
         * something else failed down the line
         */
        if (nextInvalidIndex > invalidIndex) {
          return rehomeInvalidIndex(ruleSet, clone, nextInvalidIndex);
        }
      }
    };

    test('can rehome index in 75,97,47,61,53', () => {
      const input = [75, 97, 47, 61, 53];

      const result = rehomeInvalidIndex(testRuleSet, input, 0);

      expect(result).toEqual([97, 75, 47, 61, 53]);
    });

    /**
     * fn only handles only one invalid index
     *
     * was gonna try brute force it
     *
     * but maybe better idea is to read up some reddit solutions...
     *
     * had an issue were rehoming first index
     * then meant I couldn't find a solution for the FOLLOWING one.
     * I think.
     * Having a hard time following all the loops
     */
    test.only('can rehome index in 97,13,75,29,47', () => {
      const input = [97, 13, 75, 29, 47];

      const result = rehomeInvalidIndex(testRuleSet, input, 1);

      expect(result).toEqual([97, 75, 47, 29, 13]);
    });
  });
});
