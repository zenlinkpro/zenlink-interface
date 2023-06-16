import type { Pair } from '@zenlink-interface/amm'
import { ParachainId, chainShortName } from '@zenlink-interface/chain'
import type { Type } from '@zenlink-interface/currency'
import { tryParseAmount } from '@zenlink-interface/currency'
import type { BreadcrumbLink } from '@zenlink-interface/ui'
import { AppearOnMount, Button, Dots, Loader, Widget } from '@zenlink-interface/ui'
import type { FC, ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR, { SWRConfig } from 'swr'
import type { Pool, StableSwap } from '@zenlink-interface/graph-client'
import { PlusIcon } from '@heroicons/react/24/outline'
import stringify from 'fast-json-stable-stringify'
import { useCustomTokens } from '@zenlink-interface/shared'
import {
  Checker,
  PairState,
  PoolFinder,
  PoolFinderType,
  Web3Input,
  isSubstrateNetwork,
} from '@zenlink-interface/compat'
import { AddSectionMyPosition } from 'components/AddSection/AddSectionMyPosition'
import { isStandardPool } from 'lib/functions'
import { useTokens } from 'lib/state/token-lists'
import { AMM_ENABLED_NETWORKS } from 'config'
import {
  AddSectionReviewModalStandard,
  AddSectionStable,
  Layout,
  PoolPositionProvider,
  PoolPositionStakedProvider,
  SelectNetworkWidget,
  SelectPoolTypeWidget,
  SelectStablePoolWidget,
  SettingsOverlay,
} from 'components'
import { Trans, t } from '@lingui/macro'

const LINKS: BreadcrumbLink[] = [
  {
    href: '/add',
    label: 'Add',
  },
]

const Add = () => {
  const [chainId, setChainId] = useState(ParachainId.CALAMARI_KUSAMA)
  const [poolType, setPoolType] = useState(PoolFinderType.Standard)
  const [pool, setPool] = useState<Pool | undefined>()
  const [selectedStablePool, setStablePool] = useState<StableSwap | undefined>()
  const { data } = useSWR<StableSwap[] | undefined>(
    `/pool/api/stablePools?networks=${stringify([chainId])}`,
    url => fetch(url).then(response => response.json()),
  )

  const poolForPosition = useMemo(
    () => poolType === PoolFinderType.Standard ? pool : selectedStablePool,
    [pool, poolType, selectedStablePool],
  )

  useEffect(() => {
    if (!selectedStablePool || selectedStablePool.chainId !== chainId)
      setStablePool(data?.[0])
  }, [chainId, data, selectedStablePool, selectedStablePool?.chainId])

  return (
    <SWRConfig>
      <Layout breadcrumbs={LINKS}>
        <div className="grid grid-cols-1 sm:grid-cols-[340px_auto] md:grid-cols-[auto_396px_264px] gap-10">
          <div className="hidden md:block" />
          <div className="flex flex-col order-3 gap-3 pb-40 sm:order-2">
            <SelectNetworkWidget selectedNetwork={chainId} onSelect={setChainId} />
            <SelectPoolTypeWidget
              selectedNetwork={chainId}
              poolType={poolType}
              setPoolType={(type) => {
                setPoolType(type)
              }}
            />
            {poolType === PoolFinderType.Stable && (
              <SelectStablePoolWidget
                selectedStablePool={selectedStablePool}
                setStablePool={setStablePool}
                stablePools={data}
              />
            )}
            {poolType === PoolFinderType.Standard && <AddStandard chainId={chainId} setPool={setPool} />}
            {poolType === PoolFinderType.Stable && selectedStablePool && (<AddSectionStable pool={selectedStablePool} />)}
          </div>
          {poolForPosition && (
            <PoolPositionProvider pool={poolForPosition}>
              <PoolPositionStakedProvider pool={poolForPosition}>
                <div className="order-1 sm:order-3">
                  <AppearOnMount>
                    <AddSectionMyPosition pool={poolForPosition} />
                  </AppearOnMount>
                </div>
              </PoolPositionStakedProvider>
            </PoolPositionProvider>
          )}
        </div>
      </Layout>
    </SWRConfig>
  )
}

interface AddStandardProps {
  chainId: ParachainId
  setPool(pool: Pool | undefined): void
}

const AddStandard: FC<AddStandardProps> = ({ chainId, setPool }) => {
  const [token0, setToken0] = useState<Type | undefined>()
  const [token1, setToken1] = useState<Type | undefined>()

  useEffect(() => {
    setToken0(undefined)
    setToken1(undefined)
  }, [chainId])

  return (
    <PoolFinder
      components={
        <PoolFinder.Components>
          <PoolFinder.StandardPool
            chainId={chainId}
            token0={token0}
            token1={token1}
            enabled={AMM_ENABLED_NETWORKS.includes(chainId)}
          />
        </PoolFinder.Components>
      }
    >
      {({ pool: [poolState, pool] }) => {
        const title
          = !token0 || !token1
            ? (
                t`Select Tokens`
              )
            : [PairState.LOADING].includes(poolState)
                ? (
                <div className="h-[20px] flex items-center justify-center">
                  <Loader width={14} />
                </div>
                  )
                : [PairState.EXISTS].includes(poolState)
                    ? (
                        t`Add Liquidity`
                      )
                    : (
                        isSubstrateNetwork(chainId) ? t`This network does not allow create pool` : t`Create Pool`
                      )

        return (
          <_AddStandard
            chainId={chainId}
            setPool={setPool}
            pool={pool}
            poolState={poolState}
            title={title}
            token0={token0}
            token1={token1}
            setToken0={setToken0}
            setToken1={setToken1}
          />
        )
      }}
    </PoolFinder>
  )
}

interface AddStandardWidgetProps {
  chainId: ParachainId
  pool: Pair | null
  poolState: PairState
  title: ReactNode
  token0: Type | undefined
  token1: Type | undefined
  setToken0(token: Type): void
  setToken1(token: Type): void
  setPool(pool: Pool | undefined): void
}

const _AddStandard: FC<AddStandardWidgetProps> = ({
  chainId,
  pool,
  poolState,
  title,
  token0,
  token1,
  setToken0,
  setToken1,
  setPool,
}) => {
  const { data } = useSWR<{ pool: Pool }>(
    pool?.liquidityToken.address
      ? `/pool/api/pool/${chainShortName[chainId]}:${pool.liquidityToken.address.toLowerCase()}`
      : null,
    url => fetch(url).then(response => response.json()),
  )

  useEffect(() => {
    setPool(data?.pool)
  }, [data?.pool, setPool])

  const [customTokensMap, { addCustomToken, removeCustomToken }] = useCustomTokens(chainId)
  const tokenMap = useTokens(chainId)
  const [{ input0, input1 }, setTypedAmounts] = useState<{ input0: string; input1: string }>({ input0: '', input1: '' })

  const [parsedInput0, parsedInput1] = useMemo(() => {
    return [tryParseAmount(input0, token0), tryParseAmount(input1, token1)]
  }, [input0, input1, token0, token1])

  const onChangeToken0TypedAmount = useCallback(
    (value: string) => {
      if (
        poolState === PairState.NOT_EXISTS
      ) {
        setTypedAmounts(prev => ({
          ...prev,
          input0: value,
        }))
      }
      else if (token0 && pool) {
        const parsedAmount = tryParseAmount(value, token0)
        setTypedAmounts({
          input0: value,
          input1: parsedAmount ? pool.priceOf(token0.wrapped).quote(parsedAmount.wrapped).toExact() : '',
        })
      }
    },
    [pool, poolState, token0],
  )

  const onChangeToken1TypedAmount = useCallback(
    (value: string) => {
      if (
        poolState === PairState.NOT_EXISTS
      ) {
        setTypedAmounts(prev => ({
          ...prev,
          input1: value,
        }))
      }
      else if (token1 && pool) {
        const parsedAmount = tryParseAmount(value, token1)
        setTypedAmounts({
          input0: parsedAmount ? pool.priceOf(token1.wrapped).quote(parsedAmount.wrapped).toExact() : '',
          input1: value,
        })
      }
    },
    [pool, poolState, token1],
  )

  useEffect(() => {
    if (pool)
      onChangeToken0TypedAmount(input0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChangeToken0TypedAmount])

  return (
    <>
      <Widget id="addLiquidity" maxWidth={440}>
        <Widget.Content>
          <Widget.Header title={<Trans>Add Liquidity</Trans>}>
            <SettingsOverlay chainId={chainId} />
          </Widget.Header>
          <Web3Input.Currency
            className="p-3"
            value={input0}
            onChange={onChangeToken0TypedAmount}
            currency={token0}
            onSelect={setToken0}
            customTokenMap={customTokensMap}
            onAddToken={addCustomToken}
            onRemoveToken={removeCustomToken}
            chainId={chainId}
            tokenMap={tokenMap}
          />
          <div className="flex items-center justify-center -mt-[12px] -mb-[12px] z-10">
            <div className="group bg-slate-300 dark:bg-slate-700 p-0.5 border-2 border-slate-400 dark:border-slate-800 transition-all rounded-full hover:ring-2 hover:ring-slate-500 cursor-pointer">
              <PlusIcon width={16} height={16} />
            </div>
          </div>
          <div className="bg-slate-200 dark:bg-slate-800">
            <Web3Input.Currency
              className="p-3 !pb-1"
              value={input1}
              onChange={onChangeToken1TypedAmount}
              currency={token1}
              onSelect={setToken1}
              customTokenMap={customTokensMap}
              onAddToken={addCustomToken}
              onRemoveToken={removeCustomToken}
              chainId={chainId}
              tokenMap={tokenMap}
              loading={
                poolState === PairState.LOADING
              }
            />
            <div className="p-3">
              <Checker.Connected chainId={chainId} fullWidth size="md">
                <Checker.Network fullWidth size="md" chainId={chainId}>
                  <Checker.Amounts
                    fullWidth
                    size="md"
                    chainId={chainId}
                    amounts={[parsedInput0, parsedInput1]}
                  >
                    {((pool && isStandardPool(pool)) || (!pool)) && (
                      <AddSectionReviewModalStandard
                        poolState={poolState as PairState}
                        chainId={chainId}
                        token0={token0}
                        token1={token1}
                        input0={parsedInput0}
                        input1={parsedInput1}
                      >
                        {({ isWritePending, setOpen }) => (
                          <Button
                            fullWidth
                            onClick={() => setOpen(true)}
                            disabled={
                              isWritePending
                              || (isSubstrateNetwork(chainId) && poolState === PairState.NOT_EXISTS)
                            }
                            size="md"
                          >
                            {isWritePending ? <Dots><Trans>Confirm transaction</Trans></Dots> : title}
                          </Button>
                        )}
                      </AddSectionReviewModalStandard>
                    )}
                  </Checker.Amounts>
                </Checker.Network>
              </Checker.Connected>
            </div>
          </div>
        </Widget.Content>
      </Widget>
    </>
  )
}

export default Add
