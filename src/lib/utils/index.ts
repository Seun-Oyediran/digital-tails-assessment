export function linearMapValue(
  value: number,
  oldMin = 1,
  oldMax = 2.4,
  newMin = 0,
  newMax = 0.65
) {
  return newMin + ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin);
}
