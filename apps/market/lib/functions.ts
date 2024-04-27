import type { Market } from '@zenlink-interface/market'
import { format } from 'date-fns'

export function getMaturityFormatDate(market: Market): string {
  return format(Number(market.expiry.toString()) * 1000, 'dd MMM yyyy')
}
