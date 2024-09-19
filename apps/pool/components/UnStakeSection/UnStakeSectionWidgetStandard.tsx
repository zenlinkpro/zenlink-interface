import type { ParachainId } from '@zenlink-interface/chain'
import type { Pair } from '@zenlink-interface/graph-client'
import type { PoolFarmWithIncentives } from 'lib/hooks'
import type { FC } from 'react'
import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Trans } from '@lingui/macro'
import { Checker, useAccount, useWithdrawFarmingReview } from '@zenlink-interface/compat'
import { tryParseAmount } from '@zenlink-interface/currency'
import { formatPercent, formatUSD } from '@zenlink-interface/format'
import { useIsMounted } from '@zenlink-interface/hooks'
import { Percent, ZERO } from '@zenlink-interface/math'
import {
  AppearOnMount,
  Button,
  classNames,
  Currency,
  DEFAULT_INPUT_UNSTYLED,
  Dots,
  Input,
  Typography,
} from '@zenlink-interface/ui'
import { Widget } from '@zenlink-interface/ui/widget'
import { usePoolPositionStaked } from 'components/PoolPositionStakedProvider'
import { incentiveRewardToToken } from 'lib/functions'
import { useFarmsFromPool, useTokenAmountDollarValues, useUnderlyingTokenBalanceFromPool } from 'lib/hooks'
import { Fragment, useMemo, useState } from 'react'

interface UnStakeSectionWidgetStandardProps {
  isFarm: boolean
  pair: Pair
  chainId: ParachainId
}

export const UnStakeSectionWidgetStandard: FC<UnStakeSectionWidgetStandardProps> = ({
  isFarm,
  chainId,
  pair,
}) => {
  const isMounted = useIsMounted()
  const [hover, setHover] = useState(false)
  const { address } = useAccount()
  const { balance } = usePoolPositionStaked()

  const { farms } = useFarmsFromPool(pair)

  return (
    <div className="relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Transition
        as={Fragment}
        enter="transition duration-300 origin-center ease-out"
        enterFrom="transform opacity-0"
        enterTo="transform opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
        show={Boolean(hover && !balance?.greaterThan(ZERO) && address)}
      >
        <div className="border border-slate-200/5 flex justify-center items-center z-[100] absolute inset-0 backdrop-blur bg-black bg-opacity-[0.24] rounded-2xl">
          <Typography className="bg-white bg-opacity-[0.12] rounded-full p-2 px-3" variant="xs" weight={600}>
            No staked tokens found {isFarm && ', did you stake liquidity first?'}
          </Typography>
        </div>
      </Transition>
      <Widget className="bg-slate-200 dark:bg-slate-800" id="unStakeLiquidity" maxWidth={440}>
        <Widget.Content>
          <Disclosure defaultOpen={true}>
            {({ open }) => (
              <>
                {isFarm && isMounted
                  ? (
                      <Widget.Header className="!pb-3 " title={<Trans>UnStake Liquidity</Trans>}>
                        <div className="flex gap-3">
                          <Disclosure.Button className="w-full pr-0.5">
                            <div className="flex items-center justify-between">
                              <div
                                className={classNames(
                                  open ? 'rotate-180' : 'rotate-0',
                                  'transition-all w-5 h-5 -mr-1.5 flex items-center delay-300',
                                )}
                              >
                                <ChevronDownIcon
                                  className="group-hover:text-slate-200 text-slate-300"
                                  height={24}
                                  width={24}
                                />
                              </div>
                            </div>
                          </Disclosure.Button>
                        </div>
                      </Widget.Header>
                    )
                  : (
                      <Widget.Header className="!pb-3" title={<Trans>UnStake Liquidity</Trans>} />
                    )}
                <Transition
                  as="div"
                  className="transition-[max-height]"
                  enter="duration-300 ease-in-out"
                  enterFrom="transform max-h-0"
                  enterTo="transform max-h-[380px]"
                  leave="transition-[max-height] duration-250 ease-in-out"
                  leaveFrom="transform max-h-[380px]"
                  leaveTo="transform max-h-0"
                  show
                  unmount={false}
                >
                  <Disclosure.Panel unmount={false}>
                    <div className="text-sm leading-5 font-normal px-3 pb-5 text-slate-400">
                      <Trans>
                        Unstake your liquidity tokens first if you mean to remove your liquidity position
                      </Trans>
                    </div>
                    {farms.map(farm => (
                      <UnStakeSectionWidgetStandardItem
                        chainId={chainId}
                        farm={farm}
                        key={farm.pid}
                      />
                    ))}
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        </Widget.Content>
      </Widget>
    </div>
  )
}

interface UnStakeSectionWidgetStandardItemProps {
  farm: PoolFarmWithIncentives
  chainId: ParachainId
}

export const UnStakeSectionWidgetStandardItem: FC<UnStakeSectionWidgetStandardItemProps> = ({
  chainId,
  farm,
}) => {
  const isMounted = useIsMounted()
  const { reserves, farmStakedMap, totalSupply } = usePoolPositionStaked()
  const [value, setValue] = useState<string>()

  const pid = farm.pid

  const balance = useMemo(() => {
    return farmStakedMap?.[pid]?.balance
  }, [farmStakedMap, pid])

  const amountToWithdraw = useMemo(
    () => balance?.currency
      ? tryParseAmount(value ?? '0', balance.currency)
      : undefined,
    [balance?.currency, value],
  )

  const { sendTransaction, isWritePending } = useWithdrawFarmingReview({
    chainId,
    amountToWithdraw,
    pid,
  })

  const underlying = useUnderlyingTokenBalanceFromPool({
    reserves,
    totalSupply,
    balance: amountToWithdraw,
  })

  const values = useTokenAmountDollarValues({
    chainId,
    amounts: underlying,
  })

  return (
    <div className="relative border-t border-slate-500/20 dark:border-slate-200/5 mb-3">
      <Transition
        as="div"
        className="transition-[max-height]"
        enter="duration-300 ease-in-out"
        enterFrom="transform max-h-0"
        enterTo="transform"
        leave="transition-[max-height] duration-250 ease-in-out"
        leaveFrom="transform"
        leaveTo="transform max-h-0"
        show
        unmount={false}
      >
        <div className="flex flex-col gap-3 px-3 pt-3">
          <div className="flex text-xs leading-5 font-medium  text-slate-600 dark:text-slate-400 justify-between">
            <Typography className="dark:text-slate-400 text-gray-600" variant="xs" weight={400}>
              {`PID: ${farm.pid}`}
            </Typography>
            <div className="flex items-center justify-center">
              <Typography className="dark:text-slate-400 text-gray-600" variant="xs" weight={400}>
                <Trans>Rewards</Trans>
                :
              </Typography>
              <div className="ml-2">
                <Currency.IconList iconHeight={16} iconWidth={16}>
                  {farm.incentives?.map((incentive: any, index: number) => (<Currency.Icon currency={incentiveRewardToToken(chainId, incentive)} key={index} />
                  ))}
                </Currency.IconList>
              </div>
            </div>
            <Typography className="dark:text-slate-400 text-gray-600" variant="xs" weight={400}>
              <Trans>
                APR
              </Trans>
              {`: ${formatPercent(farm.stakeApr)}`}
            </Typography>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-between flex-grow">
              <Input.Numeric
                className={classNames(DEFAULT_INPUT_UNSTYLED, '!text-2xl')}
                onUserInput={val => setValue(val)}
                placeholder="0"
                value={value}
                variant="unstyled"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setValue(balance?.multiply(new Percent(25, 100)).toExact())} size="xs">
                25%
              </Button>
              <Button onClick={() => setValue(balance?.multiply(new Percent(50, 100)).toExact())} size="xs">
                50%
              </Button>
              <Button onClick={() => setValue(balance?.multiply(new Percent(75, 100)).toExact())} size="xs">
                75%
              </Button>
              <Button onClick={() => setValue(balance?.multiply(new Percent(100, 100)).toExact())} size="xs">
                MAX
              </Button>
            </div>
          </div>
          <div className="grid items-center justify-between grid-cols-3">
            <AppearOnMount show={Boolean(balance)}>
              <Typography className="text-slate-700 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200" variant="sm" weight={500}>
                {formatUSD(formatUSD(values.reduce((total, current) => total + current, 0)))}
              </Typography>
            </AppearOnMount>
            <AppearOnMount
              className="flex justify-end col-span-2"
              show={Boolean(balance)}
            >
              <Typography
                as="button"
                className="truncate text-slate-700 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200"
                onClick={() => setValue(balance?.multiply(new Percent(100, 100)).toExact())}
                variant="sm"
                weight={500}
              >
                <Trans>
                  Balance: {balance?.toSignificant(6)}
                </Trans>
              </Typography>
            </AppearOnMount>
          </div>
          <Checker.Connected chainId={chainId} fullWidth size="md">
            <Checker.Custom
              guard={(
                <Button disabled={true} fullWidth size="md">
                  <Trans>Insufficient Balance</Trans>
                </Button>
              )}
              showGuardIfTrue={isMounted && (!!balance) && (!!amountToWithdraw) && ((amountToWithdraw.greaterThan(balance)))}
            >
              <Checker.Network chainId={chainId} fullWidth size="md">
                <Checker.Custom
                  guard={(
                    <Button disabled={true} fullWidth size="md">
                      <Trans>Enter Amount</Trans>
                    </Button>
                  )}
                  showGuardIfTrue={false}
                >
                  <Button
                    disabled={isWritePending || !(amountToWithdraw?.greaterThan('0'))}
                    fullWidth
                    onClick={() => sendTransaction?.()}
                    size="md"
                    variant="filled"
                  >
                    {isWritePending ? <Dots><Trans>Confirm transaction</Trans></Dots> : <Trans>Unstake Liquidity</Trans>}
                  </Button>
                </Checker.Custom>
              </Checker.Network>
            </Checker.Custom>
          </Checker.Connected>
        </div>
      </Transition>
    </div>
  )
}
