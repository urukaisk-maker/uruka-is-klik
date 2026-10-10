export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout | undefined;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), waitMs);
  };
}
