import { cronParser } from "./cronParser";
import { getTodayAtMidnight } from "./utils/index"

interface ParseResult {
  s: number[];
  m: number[];
  h: number[];
  d: number[];
  M: number[];
  w: number[];
}

class Schedule {
  cb: Function = () => { };
  timeStructure: ParseResult = {
    s: [],
    m: [],
    h: [],
    d: [],
    M: [],
    w: []
  };
  setupSecs: number[] = [];

  constructor(timeExpression: string | ParseResult, cb: Function) {
    this.cb = cb;
    if (typeof timeExpression === 'string') {
      this.timeStructure = this.parseExpression(timeExpression);
    } else {
      this.timeStructure = timeExpression;
    }
    this.calculateCycletimeCost();
  }

  parseExpression(timeExpression: string): ParseResult {
    return cronParser(timeExpression);
  }

  // 辅助函数：将时间转换为秒数
  private timeToSeconds(hour: number, minute: number, second: number): number {
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, second);
    return date.getTime() / 1000;
  }

  // 计算当日内的触发秒数
  calculateCycletimeCost() {
    const today = new Date();
    const { s, m, h, d, M, w } = this.timeStructure;

    if (w.length === 0 || w.includes(today.getDay())) {
      if (M.length === 0 || M.includes(today.getMonth())) {
        if (d.length === 0 || d.includes(today.getDate())) {
          for (const hour of h) {
            for (const minute of m) {
              for (const second of s) {
                const seconds = this.timeToSeconds(hour, minute, second);
                this.setupSecs.push(seconds - getTodayAtMidnight().getTime() / 1000);
              }
            }
          }
        }
      }
    }
  }
}

export { Schedule }