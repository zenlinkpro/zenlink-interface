import type { ParachainId } from '@zenlink-interface/chain'
import type { Dispatch, FC, SetStateAction } from 'react'
import { Trans } from '@lingui/macro'
import { Checker } from '@zenlink-interface/compat'
import { Button, classNames, DEFAULT_INPUT_PADDING, DEFAULT_INPUT_UNSTYLED, Dialog, Dots, Typography } from '@zenlink-interface/ui'
import { useSetCodeReview } from '@zenlink-interface/wagmi'
import { REFERRALS_ENABLED_NETWORKS } from 'config'
import { formatBytes32String } from 'ethers/lib/utils.js'
import { useCallback, useMemo, useState } from 'react'

interface SetCodeModalProps {
  chainId?: ParachainId
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  initialReferralCode?: string
  ownedCodes: string[]
}

export const SetCodeModal: FC<SetCodeModalProps> = ({
  chainId,
  open,
  setOpen,
  initialReferralCode,
  ownedCodes,
}) => {
  const [inputCode, setInputCode] = useState(initialReferralCode || '')
  const [error, setError] = useState<string>()

  const onSuccess = useCallback(() => {
    setInputCode('')
  }, [])

  const { isWritePending, sendTransaction } = useSetCodeReview({
    chainId,
    code: inputCode,
    open,
    setOpen,
    onSuccess,
    setError,
  })

  const isInputOwnedCodes = useMemo(() =>
    ownedCodes.includes(formatBytes32String(inputCode))
  , [inputCode, ownedCodes])

  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <Dialog.Content className="max-w-sm !pb-2">
        <Dialog.Header border={false} onClose={() => setOpen(false)} title={<Trans>Enter Referral Code</Trans>} />
        <div className="flex flex-col p-2 gap-4">
          <div className="ring-offset-2 ring-offset-slate-100 dark:ring-offset-slate-800 flex gap-2 bg-slate-200 dark:bg-slate-700 pr-3 w-full relative items-center justify-between rounded-2xl focus-within:ring-2 text-primary ring-blue">
            <input
              className={classNames(DEFAULT_INPUT_UNSTYLED, DEFAULT_INPUT_PADDING)}
              onInput={e => setInputCode(e.currentTarget.value)}
              placeholder="zenlink"
              type="text"
              value={inputCode}
            />
          </div>
          <div className="w-full">
            <Checker.Connected chainId={chainId} fullWidth size="default">
              <Checker.Network chainId={chainId} fullWidth size="default">
                <Checker.Custom
                  guard={(
                    <>
                      <Button
                        disabled={false}
                        fullWidth
                        onClick={() => setInputCode('zenlink')}
                        size="default"
                      >
                        <Trans>
                          Enter your referral code or
                          <span className="text-red-400">zenlink</span>
                        </Trans>
                      </Button>
                    </>
                  )}
                  showGuardIfTrue={!inputCode}
                >
                  <Button
                    disabled={
                      !inputCode
                      || isInputOwnedCodes
                      || isWritePending
                      || !chainId
                      || !REFERRALS_ENABLED_NETWORKS.includes(chainId)
                    }
                    fullWidth
                    onClick={() => sendTransaction?.()}
                    size="default"
                  >
                    {!inputCode
                      ? <Trans>Enter a code</Trans>
                      : isInputOwnedCodes
                        ? <Trans>No self-referral</Trans>
                        : isWritePending
                          ? <Dots><Trans>Confirm submit</Trans></Dots>
                          : <Trans>Submit</Trans>}
                  </Button>
                </Checker.Custom>
              </Checker.Network>
            </Checker.Connected>
          </div>
        </div>
        {error && (
          <Typography className="mt-4 text-center text-red" variant="xs" weight={500}>
            {error}
          </Typography>
        )}
      </Dialog.Content>
    </Dialog>
  )
}
