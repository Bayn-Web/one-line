export class cronError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CronError";
  }
}