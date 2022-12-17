import { ParachainId } from '@zenlink-interface/chain'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useDynamicValue } from '@zenlink-interface/hooks'
import type { StorageContext } from '../context'
import type { GasPrice, StorageState, WithStorageState } from '../types'

type UseSettingsReturn = [
  Omit<StorageState, 'customTokens'>,
  {
    updateCarbonOffset(carbonOffset: boolean): void
    updateSlippageTolerance(slippageTolerance: number): void
    updateSlippageToleranceType(slippageToleranceType: 'auto' | 'custom'): void
    updateMaxFeePerGas(updateMaxFeePerGas: number | string | undefined): void
    updateMaxPriorityFeePerGas(maxPriorityFeePerGas: number | string | undefined): void
    updateGasPrice(gasPrice: GasPrice): void
    updateGasType(gasType: 'preset' | 'custom'): void
    updateTransactionDeadline(deadline: number): void
    updateParachainId(parachainId: ParachainId): void
  },
]

type UseSettings = (context: StorageContext) => UseSettingsReturn

export const useSettings: UseSettings = (context) => {
  const { reducerPath, actions } = context
  const { ...settings } = useSelector((state: WithStorageState) => state[reducerPath])
  const dispatch = useDispatch()

  const updateCarbonOffset = useCallback(
    (carbonOffset: boolean) => {
      dispatch(actions.updateCarbonOffset({ carbonOffset }))
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

  const dynamicSettings = useDynamicValue(settings, { parachainId: ParachainId.ASTAR })

  return [
    dynamicSettings,
    {
      updateCarbonOffset,
      updateSlippageTolerance,
      updateSlippageToleranceType,
      updateMaxFeePerGas,
      updateMaxPriorityFeePerGas,
      updateGasPrice,
      updateGasType,
      updateTransactionDeadline,
      updateParachainId,
    },
  ]
}
