import type { Cursor, IZiOrders } from '.'
import { IZI_LEFT_MOST_PT, IZI_RIGHT_MOST_PT } from '.'

export function findLeftFromCursor(
  orders: IZiOrders,
  currentCursor: Cursor,
  currentPoint: number,
): Cursor {
  let liquidityIdx = currentCursor.liquidityIdx
  while (liquidityIdx >= 0 && orders.liquidityDeltaPoint[liquidityIdx] > currentPoint)
    --liquidityIdx

  let sellingIdx = currentCursor.sellingIdx
  while (sellingIdx >= 0 && orders.sellingYPoint[sellingIdx] > currentPoint)
    --sellingIdx

  const isLiquidityPoint = (liquidityIdx >= 0) && (orders.liquidityDeltaPoint[liquidityIdx] === currentPoint)
  const isLimitOrderPoint = (sellingIdx >= 0) && (orders.sellingYPoint[sellingIdx] === currentPoint)
  return { liquidityIdx, sellingIdx, currentPoint, isLimitOrderPoint, isLiquidityPoint }
}

export function findRightFromCursor(
  orders: IZiOrders,
  currentCursor: Cursor,
  currentPoint: number,
): Cursor {
  let liquidityIdx = currentCursor.liquidityIdx
  const liquidityLength = orders.liquidity.length
  while (liquidityIdx < liquidityLength && orders.liquidityDeltaPoint[liquidityIdx] <= currentPoint)
    ++liquidityIdx

  liquidityIdx--
  let sellingIdx = currentCursor.sellingIdx
  const sellingLength = orders.sellingX.length
  while (sellingIdx < sellingLength && orders.sellingXPoint[sellingIdx] < currentPoint)
    ++sellingIdx

  const isLiquidityPoint = (liquidityIdx >= 0) && (orders.liquidityDeltaPoint[liquidityIdx] === currentPoint)
  const isLimitOrderPoint = (sellingIdx < sellingLength) && (orders.sellingXPoint[sellingIdx] === currentPoint)
  return { liquidityIdx, sellingIdx, currentPoint, isLimitOrderPoint, isLiquidityPoint }
}

export function nearestLeftOneOrBoundary(
  orders: IZiOrders,
  currentCursor: Cursor,
  point: number,
  pointDelta: number,
): number {
  const liquidityPoint = currentCursor.liquidityIdx >= 0 ? orders.liquidityDeltaPoint[currentCursor.liquidityIdx] : IZI_LEFT_MOST_PT
  const sellingPoint = currentCursor.sellingIdx >= 0 ? orders.sellingYPoint[currentCursor.sellingIdx] : IZI_LEFT_MOST_PT
  const nextPoint = Math.max(liquidityPoint, sellingPoint)
  const mapPt = Math.floor(point / pointDelta)

  const bitIdx = (mapPt % 256 + 256) % 256
  const leftPtInBlock = (mapPt - bitIdx) * pointDelta
  return Math.max(nextPoint, leftPtInBlock)
}

export function nearestRightOneOrBoundary(
  orders: IZiOrders,
  currentCursor: Cursor,
  point: number,
  pointDelta: number,
): number {
  const liquidityLength = orders.liquidity.length
  const destLiquidityIdx = currentCursor.liquidityIdx + 1
  const liquidityPoint = destLiquidityIdx < liquidityLength ? orders.liquidityDeltaPoint[destLiquidityIdx] : IZI_RIGHT_MOST_PT
  const destSellingIdx = currentCursor.isLimitOrderPoint ? currentCursor.sellingIdx + 1 : currentCursor.sellingIdx
  const sellingPoint = destSellingIdx < orders.sellingX.length ? orders.sellingXPoint[destSellingIdx] : IZI_RIGHT_MOST_PT
  const nextPoint = Math.min(liquidityPoint, sellingPoint)
  let mapPt = Math.floor(point / pointDelta)
  // strict right of current point
  mapPt += 1
  const bitIdx = (mapPt % 256 + 256) % 256
  const rightPtInBlock = (mapPt + 255 - bitIdx) * pointDelta
  return Math.min(nextPoint, rightPtInBlock)
}
