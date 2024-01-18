import { ParachainId } from '@zenlink-interface/chain'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useDynamicObject } from '@zenlink-interface/hooks'
import type { StorageContext } from '../context'
import type { GasPrice, StorageState, WithStorageState } from '../types'

type UseSettingsReturn = [
  Omit<StorageState, 'customTokens'>,
  {
    updateAggregator(aggregator: boolean): void
    updateSlippageTolerance(slippageTolerance: number): void
    updateSlippageToleranceType(slippageToleranceType: 'auto' | 'custom'): void
    updateMaxFeePerGas(updateMaxFeePerGas: number | string | undefined): void
    updateMaxPriorityFeePerGas(maxPriorityFeePerGas: number | string | undefined): void
    updateGasPrice(gasPrice: GasPrice): void
    updateGasType(gasType: 'preset' | 'custom'): void
    updateTransactionDeadline(deadline: number): void
    updateParachainId(parachainId: ParachainId): void
    updatePolkadotConnector(polkadotConnector: string | undefined): void
    updatePolkadotAddress(polkadotAddress: string | undefined): void
    updateUserLocale(userLocale: string): void
    updateHideAggregationSwapBanner(hideAggregationSwapBanner: boolean): void
  },
]

type UseSettings = (context: StorageContext) => UseSettingsReturn

export const useSettings: UseSettings = (context) => {
  const { reducerPath } = context
  const { ...settings } = useSelector((state: WithStorageState) => state[reducerPath])
  const dispatch = useDispatch()

  const updateAggregator = useCallback(
    (aggregator: boolean) => {
      dispatch({ type: 'updateAggregator', payload: { aggregator } })
    },
    [dispatch],
  )

  const updateSlippageTolerance = useCallback(
    (slippageTolerance: number) => {
      dispatch({ type: 'updateSlippageTolerance', payload: { slippageTolerance } })
    },
    [dispatch],
  )

  const updateSlippageToleranceType = useCallback(
    (slippageToleranceType: 'auto' | 'custom') => {
      dispatch({ type: 'updateSlippageToleranceType', payload: { slippageToleranceType } })
    },
    [dispatch],
  )

  const updateMaxFeePerGas = useCallback(
    (maxFeePerGas: number | string | undefined) => {
      dispatch({ type: 'updateMaxFeePerGas', payload: { maxFeePerGas } })
    },
    [dispatch],
  )

  const updateMaxPriorityFeePerGas = useCallback(
    (maxPriorityFeePerGas: number | string | undefined) => {
      dispatch({ type: 'updateMaxPriorityFeePerGas', payload: { maxPriorityFeePerGas } })
    },
    [dispatch],
  )

  const updateGasPrice = useCallback(
    (gasPrice: GasPrice) => {
      dispatch({ type: 'updateGasPrice', payload: { gasPrice } })
    },
    [dispatch],
  )

  const updateGasType = useCallback(
    (gasType: 'preset' | 'custom') => {
      dispatch({ type: 'updateGasType', payload: { gasType } })
    },
    [dispatch],
  )

  const updateTransactionDeadline = useCallback(
    (transactionDeadline: number) => {
      dispatch({ type: 'updateTransactionDeadline', payload: { transactionDeadline } })
    },
    [dispatch],
  )

  const updateParachainId = useCallback(
    (parachainId: ParachainId) => {
      dispatch({ type: 'updateParachainId', payload: { parachainId } })
    },
    [dispatch],
  )

  const updatePolkadotConnector = useCallback(
    (polkadotConnector: string | undefined) => {
      dispatch({ type: 'updatePolkadotConnector', payload: { polkadotConnector } })
    },
    [dispatch],
  )

  const updatePolkadotAddress = useCallback(
    (polkadotAddress: string | undefined) => {
      dispatch({ type: 'updatePolkadotAddress', payload: { polkadotAddress } })
    },
    [dispatch],
  )

  const updateUserLocale = useCallback(
    (userLocale: string) => {
      dispatch({ type: 'updateUserLocale', payload: { userLocale } })
    },
    [dispatch],
  )

  const updateHideAggregationSwapBanner = useCallback(
    (hideAggregationSwapBanner: boolean) => {
      dispatch({ type: 'updateHideAggregationSwapBanner', payload: { hideAggregationSwapBanner } })
    },
    [dispatch],
  )

  const dynamicSettings = useDynamicObject(settings, {
    parachainId: ParachainId.ASTAR,
    polkadotConnector: undefined,
    polkadotAddress: undefined,
  } as StorageState)

  return [
    dynamicSettings,
    {
      updateAggregator,
      updateSlippageTolerance,
      updateSlippageToleranceType,
      updateMaxFeePerGas,
      updateMaxPriorityFeePerGas,
      updateGasPrice,
      updateGasType,
      updateTransactionDeadline,
      updateParachainId,
      updatePolkadotConnector,
      updatePolkadotAddress,
      updateUserLocale,
      updateHideAggregationSwapBanner,
    },
  ]
}
