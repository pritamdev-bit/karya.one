export function isStaleData(isoDateString: string) {
  const timestamp = new Date(isoDateString).getTime();
  const threeMinutes = 1000 * 60 * 3;

  return Date.now() - timestamp >= threeMinutes;
}