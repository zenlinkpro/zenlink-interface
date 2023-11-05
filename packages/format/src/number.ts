import numeral from 'numeral'

export function formatNumber(value: any) {
  return numeral(value).format('(0.00a)')
}

export function formatFullNumber(value: any) {
  return numeral(value).format('0,0')
}

export function formatTransactionAmount(num: number | undefined | null, maxDigits = 9) {
  if (num === 0)
    return '0.00'
  if (!num)
    return ''
  if (num < 0.00001)
    return '<0.00001'

  if (num >= 0.00001 && num < 1) {
    return `${Number(num.toFixed(5)).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 5,
    })}`
  }
  if (num >= 1 && num < 10000) {
    return `${Number(num.toPrecision(6)).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })}`
  }
  if (num >= 10000 && num < 1000000)
    return `${Number(num.toFixed(2)).toLocaleString('en-US', { minimumFractionDigits: 2 })}`

  // For very large numbers, switch to scientific notation and show as much precision
  // as permissible by maxDigits param.
  if (num >= 10 ** (maxDigits - 1))
    return `${num.toExponential(maxDigits - 3)}`

  return `${Number(num.toFixed(2)).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}
