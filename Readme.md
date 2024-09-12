# oneline

## what it is

`Oneline` is a cron-like and not-cron-like pure schduler which is able to schedule tasks in a single line.
It allows you to schedule all the tasks in a single timer.
And it is a cron-like scheduler.
If you don't like cron, it also provides a `object literal` way to schedule tasks.
Lastly, it is pure, no and dependencies.

## how to install

```cmd
npm install @bayn/oneline
```

or

```cmd
pnpm i @bayn/oneline
```

## how to use

1. import

```js
import { scheduleManager } from "oneline";
```

2. schedule
   If we try to write a task like this:

- Setup for every 3 seconds
- Push a hello message to the logs array
- Only run three times
- Name schdule "morning alert"

```js
scheduleManager.createSchedule(
  "1/3 * * * * ?",
  (over) => {
    logs.push("hello");
    if (logs.length === 3) {
      over();
    }
  },
  "morning alert"
);
```

That's all.

And if you have no interest in cron:

```js
scheduleManager.createSchedule(
  { s: [0], m: [1], h: [2], d: [3], M: [4], w: [5] },
  (over) => {
    logs.push("hello");
    if (logs.length === 3) {
      over();
    }
  },
  "morning alert"
);
```

In this case, we set a schedule with an object literal.
It is very easy to understand.
| key | value |
|:--------| :---------:|
| s | second |
| m | minute |
| h | hour |
| d | day |
| M | month |
| w | week |

The value of each key is an array of numbers.

The above code is equivalent to the cron expression `0 1 2 3 4 5`.

It should run every day in April 3 at 2:01:00 AM and every week on Friday.

## api

#### createSchedule

- cronExpression: string | object literal

- See the above section for details.

#### getSchedule

- name: string

- Get schedule by name.

#### deleteSchedule

- name: string

- Delete schedule by name.

## about one-line

I used to use a lib called `node-schedule`.
But it have some problems make it a little unstable(maybe caused by the very old node version) and it is not been maintained for a long time(about 2 years).
So I wrote this lib to replace it.

### contribution

If you have any idea or suggestion, please feel free to open an issue or pull request.
And I am a newbee in cron, so if you have any better idea about improving cron expression, please tell me.