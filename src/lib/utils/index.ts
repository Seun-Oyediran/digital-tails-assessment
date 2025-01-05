export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

export function linearMapValue(
  value: number,
  oldMin = 1,
  oldMax = 2.4,
  newMin = 0,
  newMax = 0.655
) {
  return newMin + ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin);
}
