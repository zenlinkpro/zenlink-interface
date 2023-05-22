import { Transition } from '@headlessui/react'
import { Trans } from '@lingui/macro'
import type { Amount, Currency } from '@zenlink-interface/currency'
import { Badge, Button, Currency as CurrencyFromUi, IconButton, Tooltip, Typography, classNames } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { memo, useEffect } from 'react'

import { ApprovalState, useERC20ApproveCallback } from '../../hooks'
import { DefaultButton } from './DefaultButton'
import type { ApprovalButtonRenderProp, ApproveButton } from './types'

type RenderPropPayload = ApprovalButtonRenderProp

export interface TokenApproveButtonProps extends ApproveButton<RenderPropPayload> {
  watch?: boolean
  amount?: Amount<Currency>
  address?: string
}

export const TokenApproveButton: FC<TokenApproveButtonProps> = memo(
  ({
    watch = true,
    amount,
    address,
    render,
    dispatch,
    disabled,
    index,
    allApproved,
    hideIcon,
    initialized,
    onSuccess,
    enabled = true,
    ...props
  }: TokenApproveButtonProps) => {
    const [approvalState, onApprove] = useERC20ApproveCallback(watch, amount, address, onSuccess)

    useEffect(() => {
      if (!enabled && dispatch && index !== undefined)
        dispatch({ type: 'update', payload: { state: [ApprovalState.APPROVED, undefined, false], index } })
    }, [dispatch, enabled, index])

    // Set to undefined on unmount
    useEffect(() => {
      return () => {
        if (!dispatch || index === undefined)
          return
        dispatch({ type: 'remove', payload: { index } })
      }
    }, [dispatch, index])

    useEffect(() => {
      if (!dispatch || index === undefined || amount === undefined || !enabled)
        return

      dispatch({
        type: 'update',
        payload: {
          state: [
            approvalState,
            !amount?.currency.isNative
              ? (
                <Button
                  {...props}
                  type="button"
                  key={1}
                  className={classNames('whitespace-nowrap', props.className)}
                  onClick={onApprove}
                  disabled={disabled || approvalState === ApprovalState.PENDING}
                >
                  <Trans>Approve {amount?.currency.symbol}</Trans>
                </Button>
                )
              : undefined,
            false,
          ],
          index,
        },
      })
    }, [amount, amount?.currency.isNative, amount?.currency.symbol, approvalState, disabled, dispatch, enabled, index, onApprove, props])

    if (render)
      return render({ approvalState, onApprove })
    if (hideIcon)
      return <></>

    return (
      <Transition
        unmount={false}
        show={
          !allApproved
          && initialized
          && amount
          && !amount.currency.isNative
          && ![ApprovalState.UNKNOWN].includes(approvalState)
        }
        enter="transform transition duration-[400ms] delay-[700ms] ease-out"
        enterFrom="opacity-0 scale-50"
        enterTo="opacity-100 scale-100"
        leave="transform duration-200 transition ease-out"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <DefaultButton as="div" {...props}>
          <Tooltip
            content={
              <div className="flex flex-col gap-2 max-w-[200px]">
                <Typography variant="xs" weight={500}>
                  <Trans>Status:</Trans>
                  <span
                    className={classNames(
                      'ml-1 capitalize',
                      approvalState === ApprovalState.PENDING
                        ? 'text-yellow'
                        : approvalState === ApprovalState.APPROVED
                          ? 'text-green-600 dark:text-green'
                          : 'text-red',
                    )}
                  >
                    {approvalState.toLowerCase().replace('_', ' ')}
                  </span>
                </Typography>
                <Typography variant="xs" weight={500} className="text-slate-400">
                  <Trans>
                    We need your approval first to execute this transaction on your behalf; you will only have to approve
                    the {amount?.currency.symbol} contract once.
                  </Trans>
                </Typography>
              </div>
            }
          >
            <div>
              <Badge
                badgeContent={
                  <div
                    className={classNames(
                      approvalState === ApprovalState.PENDING
                        ? 'bg-yellow'
                        : approvalState === ApprovalState.APPROVED
                          ? 'bg-green'
                          : 'bg-red',
                      'w-2 h-2 rounded-full shadow-md',
                    )}
                  />
                }
              >
                <IconButton
                  as="div"
                  className={classNames(
                    disabled || approvalState === ApprovalState.PENDING ? 'pointer-events-none saturate-[0]' : '',
                    'flex items-center justify-center hover:scale-[1.10] transition-all',
                  )}
                  onClick={onApprove}
                >
                  {amount && (
                    <CurrencyFromUi.Icon disableLink currency={amount?.currency} width="24" height="24" />
                  )}
                </IconButton>
              </Badge>
            </div>
          </Tooltip>
        </DefaultButton>
      </Transition>
    )
  },
)
