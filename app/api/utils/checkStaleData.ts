export function isStaleData(isoDateString: string) {
  const timestamp = new Date(isoDateString).getTime();
  const fiveMinutes = 1000 * 60 * 5;

  return Date.now() - timestamp >= fiveMinutes;
}