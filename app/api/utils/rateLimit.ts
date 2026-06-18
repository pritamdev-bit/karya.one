const requests = new Map<string, number[]>();

export function checkRateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const timestamps = requests.get(key) ?? [];
    const valid = timestamps.filter((t) => now - t < windowMs);

    if (valid.length >= limit) {
        requests.set(key, valid);
        return { allowed: false, remaining: 0 };
    }

    valid.push(now);
    requests.set(key, valid);
    return { allowed: true, remaining: limit - valid.length };
}
