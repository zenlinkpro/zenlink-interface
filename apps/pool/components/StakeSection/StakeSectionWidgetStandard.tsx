import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import type { ParachainId } from '@zenlink-interface/chain'
import { Approve, Checker, useAccount, useStakeLiquidityStandardReview } from '@zenlink-interface/compat'
import { tryParseAmount } from '@zenlink-interface/currency'
import type { Pair } from '@zenlink-interface/graph-client'
import { formatPercent, formatUSD } from '@zenlink-interface/format'
import { useIsMounted } from '@zenlink-interface/hooks'
import { Percent, ZERO } from '@zenlink-interface/math'
import {
  AppearOnMount,
  Button,
  Currency,
  DEFAULT_INPUT_UNSTYLED,
  Dots,
  Input,
  Tooltip,
  Typography,
  classNames,
} from '@zenlink-interface/ui'
import { Widget } from '@zenlink-interface/ui/widget'
import type { FC } from 'react'
import { Fragment, useMemo, useState } from 'react'
import type { PoolFarmWithIncentives } from 'lib/hooks'
import { useFarmsFromPool } from 'lib/hooks'
import { useNotifications } from '@zenlink-interface/shared'
import { Trans } from '@lingui/macro'
import { usePoolPosition } from '../PoolPositionProvider'

interface StakeSectionWidgetStandardProps {
  isFarm: boolean
  chainId: ParachainId
  pair: Pair
}

export const StakeSectionWidgetStandard: FC<StakeSectionWidgetStandardProps> = ({
  isFarm,
  chainId,
  pair,
}) => {
  const isMounted = useIsMounted()
  const [hover, setHover] = useState(false)
  const { address } = useAccount()
  const { balance } = usePoolPosition()

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
            <Trans>
              No liquidity tokens found, did you add liquidity first?
            </Trans>
          </Typography>
        </div>
      </Transition>
      <Widget className="bg-slate-200 dark:bg-slate-800" id="stakeLiquidity" maxWidth={440}>
        <Widget.Content>
          <Disclosure defaultOpen={true}>
            {({ open }) => (
              <>
                {isFarm && isMounted
                  ? (
                    <Widget.Header className="!pb-3 " title={<Trans>Stake Liquidity</Trans>}>
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
                    <Widget.Header className="!pb-3" title={<Trans>Stake Liquidity</Trans>} />
                    )}
                <Transition
                  className="transition-[max-height] overflow-hidden"
                  enter="duration-300 ease-in-out"
                  enterFrom="transform max-h-0"
                  enterTo="transform max-h-[380px]"
                  leave="transition-[max-height] duration-250 ease-in-out"
                  leaveFrom="transform max-h-[380px]"
                  leaveTo="transform max-h-0"
                  unmount={false}
                >
                  <Disclosure.Panel unmount={false}>
                    <div className="text-sm leading-5 font-normal px-3 pb-5 text-slate-400">
                      <Trans>
                        Stake your liquidity tokens to receive incentive rewards on top of your pool fee rewards
                      </Trans>
                    </div>
                    {farms.length > 0
                      ? (
                        <>
                          {farms.map(farm => (
                            <StakeSectionWidgetStandardItem
                              chainId={chainId}
                              farm={farm}
                              key={farm.pid}
                            />
                          ))}
                        </>
                        )
                      : (
                        <Typography
                          className="w-full italic text-center dark:text-slate-400 text-gray-600 mb-6"
                          variant="xs"
                        >
                          <Trans>No farms found</Trans>
                        </Typography>
                        )}
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

interface StakeSectionWidgetStandardItemProps {
  chainId: ParachainId
  farm: PoolFarmWithIncentives
}

export const StakeSectionWidgetStandardItem: FC<StakeSectionWidgetStandardItemProps> = ({
  chainId,
  farm,
}) => {
  const isMounted = useIsMounted()
  const { balance, values } = usePoolPosition()
  const { address } = useAccount()
  const [, { createNotification }] = useNotifications(address)
  const pid = farm?.pid
  const [value, setValue] = useState<string>()
  const amountToStake = useMemo(
    () => balance?.currency
      ? tryParseAmount(value ?? '0', balance.currency)
      : undefined,
    [balance?.currency, value],
  )
  const { farmAddress, sendTransaction, isWritePending } = useStakeLiquidityStandardReview({
    chainId,
    amountToStake,
    pid,
  })
  const stakeValue = useMemo(() => {
    if (!amountToStake || !balance || balance.equalTo(ZERO))
      return 0
    return Number(amountToStake.asFraction.divide(balance.asFraction).toFixed(8)) * (values.reduce((total, current) => total + current, 0))
  }, [amountToStake, balance, values])

  return (
    <div className="relative border-t border-slate-500/20 dark:border-slate-200/5 mb-3">
      <Transition
        className="transition-[max-height]"
        enter="duration-300 ease-in-out"
        enterFrom="transform max-h-0"
        enterTo="transform"
        leave="transition-[max-height] duration-250 ease-in-out"
        leaveFrom="transform"
        leaveTo="transform max-h-0"
        unmount={false}
      >
        <div className="flex flex-col gap-3 px-3 pt-3">
          <div className="flex text-xs leading-5 font-medium  text-slate-600 dark:text-slate-400 justify-between">
            <Typography className="dark:text-slate-400 text-gray-600" variant="xs" weight={400}>
              {`PID: ${farm.pid}`}
            </Typography>
            <Tooltip
              content={(
                <div className="flex flex-col gap-2">
                  {farm.incentives.map((incentive, index) => (
                    <div className="flex items-center" key={incentive.token.address}>
                      <Currency.Icon currency={incentive.token} height={16} key={index} width={16} />
                      <Typography className="text-slate-600 dark:text-slate-400 ml-2" variant="xs" weight={400}>
                        <Trans>
                          {`${incentive?.rewardPerDay} ${incentive?.token?.symbol} per day`}
                        </Trans>
                      </Typography>
                    </div>
                  ))}
                </div>
              )}
            >
              <div className="flex items-center justify-center">
                <Typography className="dark:text-slate-400 text-gray-600" variant="xs" weight={400}>
                  <Trans>Rewards</Trans>
                  :
                </Typography>
                <div className="ml-2">
                  <Currency.IconList iconHeight={16} iconWidth={16}>
                    {farm.incentives.map((incentive, index) => (<Currency.Icon currency={incentive.token} key={index} />
                    ))}
                  </Currency.IconList>
                </div>
              </div>
            </Tooltip>
            <Typography className="dark:text-slate-400 text-gray-600" variant="xs" weight={400}>
              <Trans>APR</Trans>
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
          <div className="grid items-center justify-between grid-cols-3 pb-2">
            <AppearOnMount show={Boolean(balance)}>
              <Typography className="text-slate-700 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200" variant="sm" weight={500}>
                {formatUSD(stakeValue)}
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
              showGuardIfTrue={isMounted && (!!balance) && (!!amountToStake) && ((amountToStake.greaterThan(balance)))}
            >
              <Checker.Network chainId={chainId} fullWidth size="md">
                <Checker.Custom
                  guard={(
                    <Button disabled={true} fullWidth size="md">
                      <Trans>Enter Amount</Trans>
                    </Button>
                  )}
                  showGuardIfTrue={isMounted && !(amountToStake?.greaterThan('0'))}
                >
                  <Approve
                    chainId={chainId}
                    className="flex-grow !justify-end"
                    components={(
                      <Approve.Components>
                        <Approve.Token
                          address={farmAddress}
                          amount={amountToStake}
                          chainId={chainId}
                          className="whitespace-nowrap"
                          fullWidth
                          size="md"
                        />
                      </Approve.Components>
                    )}
                    onSuccess={createNotification}
                    render={({ approved }) => {
                      return (
                        <Button
                          disabled={!approved || isWritePending}
                          fullWidth
                          onClick={() => sendTransaction?.()}
                          size="md"
                          variant="filled"
                        >
                          {isWritePending
                            ? <Dots><Trans>Confirm transaction</Trans></Dots>
                            : <Trans>Stake Liquidity</Trans>}
                        </Button>
                      )
                    }}
                  />
                </Checker.Custom>
              </Checker.Network>
            </Checker.Custom>
          </Checker.Connected>
        </div>
      </Transition>
    </div>
  )
}
