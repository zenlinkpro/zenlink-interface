import type { Pair } from '@zenlink-interface/amm'
import { ParachainId, chainShortName } from '@zenlink-interface/chain'
import type { Type } from '@zenlink-interface/currency'
import { tryParseAmount } from '@zenlink-interface/currency'
import type { BreadcrumbLink } from '@zenlink-interface/ui'
import { AppearOnMount, Button, Dots, Loader, Widget } from '@zenlink-interface/ui'
import { Checker, PairState, PoolFinder, PoolFinderType, Web3Input } from '@zenlink-interface/wagmi'
import {
  AddSectionReviewModalStandard,
  Layout,
  PoolPositionProvider,
  SelectNetworkWidget,
  SelectPoolTypeWidget,
  SettingsOverlay,
} from 'components'
import { AMM_ENABLED_NETWORKS } from 'config'
import type { FC, ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR, { SWRConfig } from 'swr'
import type { Pair as PairDTO } from '@zenlink-interface/graph-client'
import { useCustomTokens } from 'lib/state/storage'
import { useTokens } from 'lib/state/token-lists'
import { PlusIcon } from '@heroicons/react/24/outline'
import { isStandardPool } from 'lib/functions'
import { AddSectionMyPosition } from 'components/AddSection/AddSectionMyPosition'

const LINKS: BreadcrumbLink[] = [
  {
    href: '/add',
    label: 'Add',
  },
]

const Add = () => {
  const [chainId, setChainId] = useState(ParachainId.ASTAR)
  const [poolType, setPoolType] = useState(PoolFinderType.Standard)

  const [token0, setToken0] = useState<Type | undefined>()
  const [token1, setToken1] = useState<Type | undefined>()

  useEffect(() => {
    setToken0(undefined)
    setToken1(undefined)
  }, [chainId])

  return (
    <SWRConfig>
      <Layout breadcrumbs={LINKS}>
        <div className="grid grid-cols-1 sm:grid-cols-[340px_auto] md:grid-cols-[auto_396px_264px] gap-10">
          <div className="hidden md:block" />
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
                      'Select Tokens'
                    )
                  : [PairState.LOADING].includes(poolState)
                      ? (
                          <div className="h-[20px] flex items-center justify-center">
                            <Loader width={14} />
                          </div>
                        )
                      : [PairState.EXISTS].includes(poolState)
                          ? (
                              'Add Liquidity'
                            )
                          : (
                              'Create Pool'
                            )

              return (
                <_Add
                  chainId={chainId}
                  setChainId={setChainId}
                  pool={pool}
                  poolState={poolState}
                  title={title}
                  token0={token0}
                  token1={token1}
                  setToken0={setToken0}
                  setToken1={setToken1}
                  poolType={poolType}
                  setPoolType={setPoolType}
                />
              )
            }}
          </PoolFinder>
        </div>
      </Layout>
    </SWRConfig>
  )
}

interface AddProps {
  chainId: ParachainId
  setChainId(chainId: ParachainId): void
  pool: Pair | null
  poolState: PairState
  title: ReactNode
  token0: Type | undefined
  token1: Type | undefined
  setToken0(token: Type): void
  setToken1(token: Type): void
  poolType: PoolFinderType
  setPoolType(type: PoolFinderType): void
}

const _Add: FC<AddProps> = ({
  chainId,
  setChainId,
  pool,
  poolState,
  title,
  token0,
  token1,
  setToken0,
  setToken1,
  poolType,
  setPoolType,
}) => {
  const { data } = useSWR<{ pair: PairDTO }>(
    pool?.liquidityToken.address
      ? `/pool/api/pool/${chainShortName[chainId]}:${pool.liquidityToken.address.toLowerCase()}`
      : null,
    url => fetch(url).then(response => response.json()),
  )

  const [customTokensMap, { addCustomToken, removeCustomToken }] = useCustomTokens(chainId)
  const tokenMap = useTokens(chainId)
  const [{ input0, input1 }, setTypedAmounts] = useState<{ input0: string; input1: string }>({ input0: '', input1: '' })

  const [parsedInput0, parsedInput1] = useMemo(() => {
    return [tryParseAmount(input0, token0), tryParseAmount(input1, token1)]
  }, [input0, input1, token0, token1])

  const onChangeToken0TypedAmount = useCallback(
    (value) => {
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
    (value) => {
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
      <div className="flex flex-col order-3 gap-3 pb-40 sm:order-2">
        <SelectNetworkWidget selectedNetwork={chainId} onSelect={setChainId} />
        <div className={'opacity-40'}>
          <SelectPoolTypeWidget
            selectedNetwork={chainId}
            poolType={poolType}
            setPoolType={(type) => {
              setPoolType(type)
            }}
          />
        </div>

        <Widget id="addLiquidity" maxWidth={400}>
          <Widget.Content>
            <Widget.Header title="4. Add Liquidity">
              <SettingsOverlay />
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
              <div className="group bg-slate-700 p-0.5 border-2 border-slate-800 transition-all rounded-full">
                <PlusIcon width={16} height={16} />
              </div>
            </div>
            <div className="bg-slate-800">
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
                <Checker.Connected fullWidth size="md">
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
                            <Button fullWidth onClick={() => setOpen(true)} disabled={isWritePending} size="md">
                              {isWritePending ? <Dots>Confirm transaction</Dots> : title}
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
      </div>

      {pool && data?.pair && (
        <PoolPositionProvider pair={data.pair}>
          <div className="order-1 sm:order-3">
            <AppearOnMount>
              <AddSectionMyPosition pair={data.pair} />
            </AppearOnMount>
          </div>
        </PoolPositionProvider>
      )}
    </>
  )
}

export default Add
