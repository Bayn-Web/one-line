export function getTodayAtMidnight() {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

export function getSecondsUntilTomorrow(): number {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const timeDifference = tomorrow.getTime() - now.getTime();
  const secondsDifference = Math.floor(timeDifference / 1000);
  return secondsDifference;
}