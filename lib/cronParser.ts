import { cronError } from "./error/cronError";
import type {ParseResult} from "../type"

const cronStrReg = /[0-9]+([-\*\/\?][0-9]+)?(\,\d+)?/;

const parseResult: ParseResult = { s: [], m: [], h: [], d: [], M: [], w: [] };

function parseField(expression: string, minVal: number, maxVal: number, field: keyof ParseResult): number[] {
  if (expression === '*') {
    return new Array(maxVal + 1).fill(0).map((_, i) => i);
  } else if (expression.includes('-')) {
    const [start, end] = expression.split('-').map(v => parseInt(v));
    if (start > maxVal || end > maxVal || start < minVal || end < minVal) {
      throw new cronError(`Check if ${field} out of range for expression: ${expression}`);
    }
    return new Array(end - start + 1).fill(0).map((_, i) => start + i);
  } else if (expression.includes(',')) {
    const values = expression.split(',').map(v => parseInt(v));
    if (values.some(v => v > maxVal) || values.some(v => v < minVal)) {
      throw new cronError(`Check if ${field} out of range for expression: ${expression}`);
    }
    return values;
  } else if (expression.includes('/')) {
    const [start, step] = expression.split('/').map(v => parseInt(v));
    if (start > maxVal || step > maxVal) {
      throw new cronError(`Check if ${field} out of range for expression: ${expression}`);
    }
    const result: number[] = [];
    for (let i = start; i <= maxVal; i += step) {
      result.push(i);
    }
    return result;
  } else {
    const value = parseInt(expression);
    if (value > maxVal || value < minVal) {
      throw new cronError(`Check if ${field} out of range for expression: ${expression}`);
    }
    return [value];
  }
}

export const cronParser = (timeExpression: string) => {
  const splitedExp = timeExpression.split(" ");
  if (6 !== (splitedExp.length)) {
    throw new cronError(`Invalid time expression: ${timeExpression}`);
  }

  const fieldParsers: { field: keyof ParseResult, minVal: number, maxVal: number }[] = [
    { field: 's', minVal: 0, maxVal: 59 },
    { field: 'm', minVal: 0, maxVal: 59 },
    { field: 'h', minVal: 0, maxVal: 23 },
    { field: 'd', minVal: 1, maxVal: 30 },
    { field: 'M', minVal: 1, maxVal: 12 },
    { field: 'w', minVal: 0, maxVal: 6 }
  ];

  for (const parser of fieldParsers) {
    const exp = splitedExp[fieldParsers.indexOf(parser)];
    if (cronStrReg.test(exp) || (exp === '*') || (exp === '?' && ['w', 'd'].includes(parser.field))) {
      parseResult[parser.field] = parseField(exp, parser.minVal, parser.maxVal, parser.field);
      if (exp === '?') {
        parseResult[parser.field] = [];
      }
    } else {
      throw new cronError(`Invalid expression for ${parser.field}: ${exp}`);
    }
  }
  return parseResult;
};