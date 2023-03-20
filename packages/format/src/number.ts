import numeral from 'numeral'

export const formatNumber = (value: any) => {
  return numeral(value).format('(0.00a)')
}

export const formatFullNumber = (value: any) => {
  return numeral(value).format('0,0')
}
