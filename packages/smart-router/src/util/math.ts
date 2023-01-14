/* eslint-disable no-console */
export function closeValues(a: number, b: number, accuracy: number, logInfoIfFalse = ''): boolean {
  if (accuracy === 0)
    return a === b
  if (Math.abs(a) < 1 / accuracy)
    return Math.abs(a - b) <= 10
  if (Math.abs(b) < 1 / accuracy)
    return Math.abs(a - b) <= 10
  const res = Math.abs(a / b - 1) < accuracy
  if (!res)
    console.log('Expected close: ', a, b, accuracy, logInfoIfFalse)

  return res
}
