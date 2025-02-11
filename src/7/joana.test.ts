// solution for https://adventofcode.com/2024/day/7 part 1

'use strict';

import { readFileSync, writeFileSync } from 'fs';

describe('joana day 7 part 1', () => {
  test('joana solves 381705: 8 6 7 4 5 78 9 7 8 500 4 9', () => {
    const input = '381705: 8 6 7 4 5 78 9 7 8 500 4 9';

    const ops: string[] = [];

    var answer = 0;

    function processInput() {
      const lines = input.split('\n');

      for (const line of lines) {
        const parts = line.trim().split(':');

        const target = parseInt(parts.shift()!);

        const tokens = parts.shift()!.trim().split(' ');

        const operands = [];

        for (const token of tokens) {
          operands.push(parseInt(token));
        }

        const operand = operands.shift()!;

        if (checkMath(target, operands.slice(0), operand, '+')) {
          ops.push('+');
          answer += target;
          continue;
        }

        if (checkMath(target, operands.slice(0), operand, '*')) {
          ops.push('*');
          answer += target;
          continue;
        }
      }

      const vs = input.split(' ');
      const r: string[] = [vs[0], vs[1]];
      ops.forEach((op, i) => {
        r.push(op);
        r.push(vs[i + 2]);
      });
      writeFileSync(__dirname + '/joanaops.txt', r.join(' '));
      writeFileSync(__dirname + '/joanaops2.txt', ops.join(' '));
    }

    function checkMath(
      target: number,
      operands: number[],
      result: number,
      operator: '+' | '*'
    ) {
      const operand = operands.shift()!;

      if (operator == '+') {
        result += operand;
      } else {
        result *= operand;
      }

      if (result > target) {
        return false;
      }

      if (operands.length == 0) {
        return target == result;
      }

      if (checkMath(target, operands.slice(0), result, '+')) {
        ops.push('+');
        return true;
      }
      if (checkMath(target, operands.slice(0), result, '*')) {
        ops.push('*');
        return true;
      }

      return false;
    }

    processInput();

    expect(ops.length).toBeGreaterThan(0);
  });
  test('joana solves day 7 part 1', () => {
    const realFile = __dirname + '/real-data.txt';

    const input = readFileSync(realFile, 'utf-8');

    const successLines: string[] = [];

    var answer = 0;

    function processInput() {
      const lines = input.split('\n');

      for (const line of lines) {
        const parts = line.trim().split(':');

        const target = parseInt(parts.shift()!);

        const tokens = parts.shift()!.trim().split(' ');

        const operands = [];

        for (const token of tokens) {
          operands.push(parseInt(token));
        }

        const operand = operands.shift()!;

        if (checkMath(target, operands.slice(0), operand, '+')) {
          successLines.push(line);
          answer += target;
          continue;
        }

        if (checkMath(target, operands.slice(0), operand, '*')) {
          successLines.push(line);
          answer += target;
          continue;
        }
      }

      writeFileSync(__dirname + '/joana.txt', successLines.join('\n'));
    }

    function checkMath(
      target: number,
      operands: number[],
      result: number,
      operator: '+' | '*'
    ) {
      const operand = operands.shift()!;

      if (operator == '+') {
        result += operand;
      } else {
        result *= operand;
      }

      if (result > target) {
        return false;
      }

      if (operands.length == 0) {
        return target == result;
      }

      if (checkMath(target, operands.slice(0), result, '+')) {
        return true;
      }
      if (checkMath(target, operands.slice(0), result, '*')) {
        return true;
      }

      return false;
    }

    processInput();

    expect(successLines.length).toBeGreaterThan(0);
  });
});
