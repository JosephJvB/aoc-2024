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
});
