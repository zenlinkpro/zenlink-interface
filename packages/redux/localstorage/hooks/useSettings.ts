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
  },
]

type UseSettings = (context: StorageContext) => UseSettingsReturn

export const useSettings: UseSettings = (context) => {
  const { reducerPath, actions } = context
  const { ...settings } = useSelector((state: WithStorageState) => state[reducerPath])
  const dispatch = useDispatch()

  const updateAggregator = useCallback(
    (aggregator: boolean) => {
      dispatch(actions.updateAggregator({ aggregator }))
    },
    [actions, dispatch],
  )

  const updateSlippageTolerance = useCallback(
    (slippageTolerance: number) => {
      dispatch(actions.updateSlippageTolerance({ slippageTolerance }))
    },
    [actions, dispatch],
  )

  const updateSlippageToleranceType = useCallback(
    (slippageToleranceType: 'auto' | 'custom') => {
      dispatch(actions.updateSlippageToleranceType({ slippageToleranceType }))
    },
    [actions, dispatch],
  )

  const updateMaxFeePerGas = useCallback(
    (maxFeePerGas: number | string | undefined) => {
      dispatch(actions.updateMaxFeePerGas({ maxFeePerGas }))
    },
    [actions, dispatch],
  )

  const updateMaxPriorityFeePerGas = useCallback(
    (maxPriorityFeePerGas: number | string | undefined) => {
      dispatch(actions.updateMaxPriorityFeePerGas({ maxPriorityFeePerGas }))
    },
    [actions, dispatch],
  )

  const updateGasPrice = useCallback(
    (gasPrice: GasPrice) => {
      dispatch(actions.updateGasPrice({ gasPrice }))
    },
    [actions, dispatch],
  )

  const updateGasType = useCallback(
    (gasType: 'preset' | 'custom') => {
      dispatch(actions.updateGasType({ gasType }))
    },
    [actions, dispatch],
  )

  const updateTransactionDeadline = useCallback(
    (transactionDeadline: number) => {
      dispatch(actions.updateTransactionDeadline({ transactionDeadline }))
    },
    [actions, dispatch],
  )

  const updateParachainId = useCallback(
    (parachainId: ParachainId) => {
      dispatch(actions.updateParachainId({ parachainId }))
    },
    [actions, dispatch],
  )

  const updatePolkadotConnector = useCallback(
    (polkadotConnector: string | undefined) => {
      dispatch(actions.updatePolkadotConnector({ polkadotConnector }))
    },
    [actions, dispatch],
  )

  const updatePolkadotAddress = useCallback(
    (polkadotAddress: string | undefined) => {
      dispatch(actions.updatePolkadotAddress({ polkadotAddress }))
    },
    [actions, dispatch],
  )

  const updateUserLocale = useCallback(
    (userLocale: string) => {
      dispatch(actions.updateUserLocale({ userLocale }))
    },
    [actions, dispatch],
  )

  const dynamicSettings = useDynamicObject(settings, {
    parachainId: ParachainId.CALAMARI_KUSAMA,
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
    },
  ]
}
