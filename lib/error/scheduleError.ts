export class scheduleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "scheduleError";
  }
}