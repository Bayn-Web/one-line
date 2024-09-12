import { it, expect,vi } from 'vitest';
import { ScheduleManager } from '../lib/index';
import { cronParser } from "../lib/cronParser";

function delay(ms: number) { return new Promise((resolve) => setTimeout(resolve, ms)); }
it('"over" callback should cancel the schedule tasks forever', { timeout: 15000 }, async () => {
  const logs: string[] = [];
  const scheduleManager = new ScheduleManager();
  scheduleManager.createSchedule('1/3 * * * * ?', (over) => {
    logs.push('hello1');
    if (logs.length === 3) {
      over();
    }
  }, 'morning alert5');
  await delay(12000);
  expect(logs).toEqual(['hello1', 'hello1', 'hello1']);
});

it("cron should parse correctly", () => {
  expect(cronParser('0 1-3 4,5 ? 9/3 ?')).toStrictEqual(
    { s: [0], m: [1, 2, 3], h: [4, 5], d: [], M: [9, 12], w: [] }
  )
})