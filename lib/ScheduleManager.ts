import { Schedule } from "./Schedule";
import { getName } from "../utils/getName";
import { scheduleError } from "./error/scheduleError";
import { getTodayAtMidnight, getSecondsUntilTomorrow } from "./utils/index";

class ScheduleManager {
  schedules: Map<string, Schedule> = new Map();
  scheduleTable: Map<number, Schedule[]> = new Map();
  sortedTimeline: Array<[number, Schedule[]]> = [];
  timer: NodeJS.Timeout | undefined = undefined;

  constructor() {
    this.schedules = new Proxy(this.schedules, {
      get: (target, prop: keyof Map<string, Schedule>, receiver) => {
        if (typeof target[prop] === 'function') {
          return (target[prop] as Function).bind(target);
        }
        // Consider other cases is key of Map
        return Reflect.get(target, prop, receiver);
      },
      set: (target, key, value, receiver) => {
        if (typeof key === 'string') {
          return Reflect.set(target, key, value, receiver);
        }
        return false;
      }
    });
  }

  createSchedule(timeExpression: string, cb: (over: () => void) => void, name: string = getName()) {
    // Check if schedule already exists
    if (this.schedules.has(name)) {
      throw new scheduleError(`Schedule ${name} already exists; Try another name`);
    }
    const overCallback = () => {
      this.deleteSchedule(name);
      this.restrictLine();
    };

    const schedule = new Schedule(timeExpression, () => {
      cb(overCallback);
    });
    this.schedules.set(name, schedule);
    this.restrictLine();
    return name;
  }

  private checkIfScheduleExists(name: string) {
    if (!this.schedules.has(name)) {
      throw new scheduleError(`Schedule ${name} does not exist; Check if it is removed`);
    }
  }

  getSchedule(name: string) {
    this.checkIfScheduleExists(name);
    return this.schedules.get(name);
  }

  deleteSchedule(name: string) {
    this.checkIfScheduleExists(name);
    this.schedules.delete(name);
    this.restrictLine();
  }

  private restrictLine() {
    this.scheduleTable.clear();
    for (let [key, schedule] of this.schedules) {
      schedule.setupSecs.forEach(v => {
        if (this.scheduleTable.has(v)) {
          this.scheduleTable.set(v, [...this.scheduleTable.get(v)!, schedule]);
        } else {
          this.scheduleTable.set(v, [schedule]);
        }
      });
    }

    // Sort and filter entries with the same timestamp
    this.sortedTimeline = Array.from(this.scheduleTable.entries()).sort((a, b) => a[0] - b[0]);
    this.sortedTimeline = this.sortedTimeline.filter(v => v[0] > (Date.now() - getTodayAtMidnight().getTime()) / 1000);
    this.startTimer();
  }

  startTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (this.sortedTimeline.length > 0) {
      const [time, schedules] = this.sortedTimeline[0];
      const nowSeconds = Math.floor((Date.now() - getTodayAtMidnight().getTime()) / 1000);
      const delay = Math.max(0, time - nowSeconds);
      this.timer = setTimeout(() => {
        schedules.forEach(schedule => schedule.cb());
        this.sortedTimeline.shift();
        this.startTimer();
      }, delay * 1000);
    } else {
      this.timer = setTimeout(() => {
        this.restrictLine();
      }, getSecondsUntilTomorrow());
    }
  }
}

export {
  ScheduleManager
}