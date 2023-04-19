import numeral from 'numeral'

export const formatUSD = (value: string | number, inputString = '$0.00a', full = false) => {
  if (!full && Number(value) < 0.01)
    return '$0.00'
  return numeral(value).format(inputString)
}
