import { Tab } from '@headlessui/react'
import { Trans } from '@lingui/macro'
import { ParachainId } from '@zenlink-interface/chain'
import { Approve, Checker, CurrencyInput, useAccount } from '@zenlink-interface/compat'
import { Amount, ZLK, tryParseAmount } from '@zenlink-interface/currency'
import { JSBI, ZERO } from '@zenlink-interface/math'
import { useNotifications } from '@zenlink-interface/shared'
import { type BreadcrumbLink, Button, Dots, Typography, Widget, classNames } from '@zenlink-interface/ui'
import { useLockVeReview, useRedeemVeReview, useVotingEscrow } from '@zenlink-interface/wagmi'
import { Layout } from 'components'
import { format } from 'date-fns'
import { TAB_DEFAULT_CLASS, TAB_NOT_SELECTED_CLASS, TAB_SELECTED_CLASS } from 'lib/constants'
import { useIncreaseLockPosition } from 'lib/hooks'
import { Duration } from 'lib/types'
import { useCallback, useMemo, useState } from 'react'
import { SWRConfig } from 'swr'

const LINKS: BreadcrumbLink[] = [
  {
    href: '/lock',
    label: 'Lock',
  },
]

function Lock() {
  return (
    <SWRConfig>
      <Layout breadcrumbs={LINKS}>
        <Tab.Group>
          <div className="flex flex-col items-center gap-5">
            <Tab.List className="flex w-48 space-x-2 rounded-full bg-blue-900/20 p-1">
              <Tab className={({ selected }) =>
                classNames(
                  selected ? TAB_SELECTED_CLASS : TAB_NOT_SELECTED_CLASS,
                  TAB_DEFAULT_CLASS,
                )}
              >
                <Trans>Lock</Trans>
              </Tab>
              <Tab className={({ selected }) =>
                classNames(
                  selected ? TAB_SELECTED_CLASS : TAB_NOT_SELECTED_CLASS,
                  TAB_DEFAULT_CLASS,
                )}
              >
                <Trans>Redeem</Trans>
              </Tab>
            </Tab.List>
            <Widget className="bg-white/50 dark:bg-slate-700/50 p-6" id="Lock" maxWidth={440}>
              <Widget.Content>
                <Tab.Panels>
                  <Tab.Panel unmount={false}>
                    <LockPanel />
                  </Tab.Panel>
                  <Tab.Panel unmount={false}>
                    <RedeemPanel />
                  </Tab.Panel>
                </Tab.Panels>
              </Widget.Content>
            </Widget>
          </div>
        </Tab.Group>
      </Layout>
    </SWRConfig>
  )
}

function LockPanel() {
  const [input, setInput] = useState('')
  const [duration, setDuration] = useState(Duration['N/A'])
  const ZLKOnMoonbeam = ZLK[ParachainId.MOONBEAM]
  const { address: account } = useAccount()
  const [, { createNotification }] = useNotifications(account)

  const onInput = useCallback((val: string) => {
    setInput(val)
  }, [])

  const additionalAmount = useMemo(
    () => tryParseAmount(input, ZLKOnMoonbeam) || Amount.fromRawAmount(ZLKOnMoonbeam, ZERO),
    [ZLKOnMoonbeam, input],
  )

  const { data: ve } = useVotingEscrow(ParachainId.MOONBEAM, { enabled: true })
  const increaseLockPosition = useIncreaseLockPosition(
    ve,
    additionalAmount,
    duration,
  )

  const votingPowerInfo = useMemo(() => {
    if (increaseLockPosition && !increaseLockPosition.newVeBalance.equalTo(0)) {
      return {
        power: increaseLockPosition.newVeBalance,
        expiry: format(increaseLockPosition.newExpiry * 1000, 'dd MMM yyyy'),
      }
    }
    if (ve && ve.currentPositionExpiry) {
      return {
        power: Amount.fromRawAmount(ZLKOnMoonbeam, ve.balance),
        expiry: format(JSBI.toNumber(ve.currentPositionExpiry) * 1000, 'dd MMM yyyy'),
      }
    }
    return undefined
  }, [ZLKOnMoonbeam, increaseLockPosition, ve])

  const onClear = useCallback(() => {
    setInput('')
    setDuration(Duration['N/A'])
  }, [])

  const { isWritePending, sendTransaction, veAddress } = useLockVeReview({
    chainId: ParachainId.MOONBEAM,
    amount: additionalAmount,
    newExpiry: increaseLockPosition?.newExpiry,
    onSuccess: onClear,
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center">
        <Typography className="text-slate-800 dark:text-slate-200" variant="xl" weight={600}>
          <Trans>Update your Lock</Trans>
        </Typography>
        <Typography className="text-slate-700 dark:text-slate-300 my-8" variant="sm" weight={500}>
          <Trans>Increase your veZLK balance by locking more ZLK and/or increasing the lock time of your locked ZLK blance.</Trans>
        </Typography>
        <div className="flex items-center justify-between w-full">
          <Typography className="text-slate-600 dark:text-slate-400" variant="sm" weight={500}>
            <Trans>Current veZLK</Trans>
          </Typography>
          <Typography className="flex justify-end truncate text-slate-800 dark:text-slate-200" variant="sm" weight={600}>
            {ve?.balance ? Amount.fromRawAmount(ZLKOnMoonbeam, ve.balance).toSignificant(4) : '0'}
          </Typography>
        </div>
        <div className="flex items-center justify-between w-full">
          <Typography className="text-slate-600 dark:text-slate-400" variant="sm" weight={500}>
            <Trans>Current Lockup Expiry</Trans>
          </Typography>
          <Typography className="flex justify-end truncate text-slate-800 dark:text-slate-200" variant="sm" weight={600}>
            {ve?.currentPositionExpiry ? format(JSBI.toNumber(ve.currentPositionExpiry) * 1000, 'dd MMM yyyy') : 'N/A'}
          </Typography>
        </div>
      </div>
      <CurrencyInput
        chainId={ParachainId.MOONBEAM}
        className="p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700"
        currency={ZLKOnMoonbeam}
        loading={!ZLKOnMoonbeam}
        onChange={onInput}
        value={input}
      />
      <div className="flex flex-col rounded-b-2xl gap-2">
        {increaseLockPosition?.newExpiry && (
          <div className="flex items-center justify-between">
            <Typography className="text-slate-600 dark:text-slate-400" variant="sm" weight={500}>
              <Trans>Additional Lock Time</Trans>
            </Typography>
            <Typography className="flex justify-end truncate text-slate-800 dark:text-slate-200" variant="xs" weight={600}>
              Withdrawal Date: {format(increaseLockPosition.newExpiry * 1000, 'dd MMM yyyy')}
            </Typography>
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <Button color="gray" onClick={() => setDuration(Duration['N/A'])} size="xs">
            N/A
          </Button>
          <Button color="gray" onClick={() => setDuration(Duration.ONE_WEEK)} size="xs">
            1W
          </Button>
          <Button color="gray" onClick={() => setDuration(Duration.ONE_MON)} size="xs">
            1M
          </Button>
          <Button color="gray" onClick={() => setDuration(Duration.THREE_MON)} size="xs">
            3M
          </Button>
          <Button color="gray" onClick={() => setDuration(Duration.SIX_MON)} size="xs">
            6M
          </Button>
          <Button color="gray" onClick={() => setDuration(Duration.ONE_YEAR)} size="xs">
            1Y
          </Button>
          <Button color="gray" onClick={() => setDuration(Duration.MAX)} size="xs">
            MAX
          </Button>
        </div>
        {votingPowerInfo && (
          <div className="rounded-2xl py-2 px-4 mb-4 bg-gradient-to-r from-blue-200/30 to-blue-300/30 dark:from-blue-500/10 dark:to-blue-600/10">
            <Typography variant="sm">
              <>
                Your voting power of
                <span className="font-semibold"> {votingPowerInfo.power.toSignificant(4)} veZLK </span>
                decays linearly over time and matures on
                <span className="font-semibold"> {votingPowerInfo.expiry}</span>.
              </>
            </Typography>
          </div>
        )}
        <Checker.Connected chainId={ParachainId.MOONBEAM} fullWidth size="md">
          <Checker.Network chainId={ParachainId.MOONBEAM} fullWidth size="md">
            <Approve
              chainId={ParachainId.MOONBEAM}
              className="flex-grow !justify-end"
              components={(
                <Approve.Components>
                  <Approve.Token
                    address={veAddress}
                    amount={additionalAmount}
                    chainId={ParachainId.MOONBEAM}
                    className="whitespace-nowrap"
                    enabled={additionalAmount?.currency?.isToken}
                    fullWidth
                    size="md"
                  />
                </Approve.Components>
              )}
              onSuccess={createNotification}
              render={({ approved }) => {
                return (
                  <Button
                    disabled={!approved || !sendTransaction || isWritePending}
                    fullWidth
                    onClick={() => sendTransaction?.()}
                    size="md"
                  >
                    {
                      isWritePending
                        ? <Dots><Trans>Confirm</Trans></Dots>
                        : <Trans>Confirm</Trans>
                    }
                  </Button>
                )
              }}
            />
          </Checker.Network>
        </Checker.Connected>
      </div>
    </div>
  )
}

function RedeemPanel() {
  const ZLKOnMoonbeam = ZLK[ParachainId.MOONBEAM]
  const { data: ve } = useVotingEscrow(ParachainId.MOONBEAM, { enabled: true })

  const { isWritePending, sendTransaction } = useRedeemVeReview({
    chainId: ParachainId.MOONBEAM,
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center">
        <Typography className="text-slate-800 dark:text-slate-200 mb-8" variant="xl" weight={600}>
          <Trans>Redeem Unlocked ZLK</Trans>
        </Typography>
        <div className="flex items-center justify-between w-full">
          <Typography className="text-slate-600 dark:text-slate-400" variant="sm" weight={500}>
            <Trans>Unlocked ZLK</Trans>
          </Typography>
          <Typography className="flex justify-end truncate text-slate-800 dark:text-slate-200" variant="sm" weight={600}>
            {ve?.redeemableAmount ? Amount.fromRawAmount(ZLKOnMoonbeam, ve.redeemableAmount).toSignificant(6) : '0'}
          </Typography>
        </div>
        <div className="flex items-center justify-between w-full">
          <Typography className="text-slate-600 dark:text-slate-400" variant="sm" weight={500}>
            <Trans>Locked ZLK</Trans>
          </Typography>
          <Typography className="flex justify-end truncate text-slate-800 dark:text-slate-200" variant="sm" weight={600}>
            {ve?.balance && !ve.isCurrentExpired ? Amount.fromRawAmount(ZLKOnMoonbeam, ve.lockedAmount).toSignificant(6) : '0'}
          </Typography>
        </div>
        <div className="flex items-center justify-between w-full">
          <Typography className="text-slate-600 dark:text-slate-400" variant="sm" weight={500}>
            <Trans>Current Lockup Expiry</Trans>
          </Typography>
          <Typography className="flex justify-end truncate text-slate-800 dark:text-slate-200" variant="sm" weight={600}>
            {ve?.currentPositionExpiry ? format(JSBI.toNumber(ve.currentPositionExpiry) * 1000, 'dd MMM yyyy') : 'N/A'}
          </Typography>
        </div>
      </div>
      <Checker.Connected chainId={ParachainId.MOONBEAM} fullWidth size="md">
        <Checker.Network chainId={ParachainId.MOONBEAM} fullWidth size="md">
          <Button
            disabled={!sendTransaction || isWritePending}
            fullWidth
            onClick={() => sendTransaction?.()}
            size="md"
          >
            {
              isWritePending
                ? <Dots><Trans>Confirm</Trans></Dots>
                : <Trans>Confirm</Trans>
            }
          </Button>
        </Checker.Network>
      </Checker.Connected>
    </div>
  )
}

export default Lock
