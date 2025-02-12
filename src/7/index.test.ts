import { readFileSync, writeFileSync } from 'fs';

describe('day 7', () => {
  const testFilePath = __dirname + '/test-data.txt';
  const realFilePath = __dirname + '/real-data.txt';

  const parseFile = (filePath: string) => {
    return readFileSync(filePath)
      .toString()
      .trim()
      .split('\n')
      .map((l) => {
        const [ans, vals] = l.split(':');
        return {
          ans: parseInt(ans),
          vals: vals
            .trim()
            .split(' ')
            .map((v) => parseInt(v)),
        };
      });
  };

  const testData = parseFile(testFilePath);
  const realData = parseFile(realFilePath);

  describe('part 1', () => {
    test('can parse test data', () => {
      expect(testData.length).toBe(9);
      expect(testData[0].ans).toBe(190);
      expect(testData[0].vals).toEqual([10, 19]);
      expect(testData[8].ans).toBe(292);
      expect(testData[8].vals).toEqual([11, 6, 16, 20]);
    });

    type Operator = 'x' | '+';

    const evaluate = (values: number[], operators: Operator[]) => {
      let result = values[0];

      for (let i = 0; i < operators.length; i++) {
        const operator = operators[i];
        const value = values[i + 1];
        switch (operator) {
          case '+':
            result += value;
            break;
          case 'x':
            result *= value;
            break;
        }
      }

      return result;
    };

    test('can evalute equation 10 + 19', () => {
      const vals: number[] = [10, 19];
      const ops: Operator[] = ['+'];

      const result = evaluate(vals, ops);

      expect(result).toBe(29);
    });

    test('can evalute equation 10 x 19', () => {
      const vals = [10, 19];
      const ops: Operator[] = ['x'];

      const result = evaluate(vals, ops);

      expect(result).toBe(190);
    });

    test('can evalute equation 11 + 6 * 16 + 20', () => {
      const vals = [11, 6, 16, 20];
      const ops: Operator[] = ['+', 'x', '+'];

      const result = evaluate(vals, ops);

      expect(result).toBe(292);
    });

    const makeCombos = (values: number[]) => {
      let combos: Operator[][] = [[]];

      const possibleOps: Operator[] = ['+', 'x'];
      for (let _ = 0; _ < values.length - 1; _++) {
        const temp = [];

        for (const combo of combos) {
          for (let i = 0; i < possibleOps.length; i++) {
            const n = combo.slice(0);
            n.splice(i, 0, possibleOps[i]);
            temp.push(n);
          }
        }

        combos = temp;
      }

      return combos;
    };

    test('can make combos 10, 19', () => {
      const input = [10, 19];

      const result = makeCombos(input);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(['+']);
      expect(result[1]).toEqual(['x']);
    });

    test('can make combos 81 40 27', () => {
      const input = [81, 40, 27];

      const result = makeCombos(input);

      expect(result).toHaveLength(4);
      /**
       * 81 + 40 + 27
       * 81 x 40 + 27
       * 81 + 40 x 27
       * 81 x 40 x 27
       */
    });

    test('can solve row 1', () => {
      const ans = 190;
      const vals = [10, 19];

      const combos = makeCombos(vals);

      const valid = combos.find((c) => evaluate(vals, c) === ans);

      expect(valid).toBeTruthy();
    });

    test('can solve row 2', () => {
      const ans = 3267;
      const vals = [81, 40, 27];

      const combos = makeCombos(vals);

      const valid = combos.find((c) => evaluate(vals, c) === ans);

      expect(valid).toBeTruthy();
    });

    test('can solve test data', () => {
      let result = 0;

      testData.forEach(({ ans, vals }) => {
        const combos = makeCombos(vals);

        const valid = combos.find((c) => evaluate(vals, c) === ans);

        if (valid) {
          result += ans;
        }
      });

      expect(result).toBe(3749);
    });

    test('it can solve 39606: 20 6 55 1 6', () => {
      const ans = 39606;
      const vals = [20, 6, 55, 1, 6];

      const combos = makeCombos(vals);

      const combosStr: string[] = [];
      combos.forEach((c) => {
        const x: string[] = [vals[0].toString()];
        c.forEach((op, i) => {
          x.push(op);
          x.push(vals[i + 1]!.toString());
        });
        x.push('=');
        x.push(evaluate(vals, c).toString());
        combosStr.push(x.join(' '));
      });
      writeFileSync(__dirname + '/combos.txt', combosStr.join('\n'));

      const validCombo = ['x', 'x', '+', 'x'];
      const vc = combos.find((c) => c.join(' ') === validCombo.join(' '));
      expect(vc).toBeTruthy();

      const valid = combos.find((c) => evaluate(vals, c) === ans);
      console.log(combos.length, valid);

      expect(valid).toBeTruthy();
    });

    test.skip('can solve real data', () => {
      let result = 0;

      // const successLines: string[] = [];

      realData.forEach(({ ans, vals }) => {
        const combos = makeCombos(vals);

        const valid = combos.find((c) => evaluate(vals, c) === ans);

        if (valid) {
          // successLines.push(`${ans}: ${vals.join(' ')}`);
          result += ans;
        }
      });

      expect(result).toBeGreaterThan(3749);
      /**
       * too low, crazy! That number is so big :o
       */
      // writeFileSync(__dirname + '/jvb.txt', successLines.join('\n'));
      expect(result).toBeGreaterThan(40696069044469);
      console.log({
        day7part1: result,
      });
    });
  });
});
