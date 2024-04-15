export function exclude<T, K extends keyof T>(data: T, keys: K[]) {
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => !keys.includes(key as K))
  );
}
