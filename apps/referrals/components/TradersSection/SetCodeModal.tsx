import type { ParachainId } from '@zenlink-interface/chain'
import { Checker } from '@zenlink-interface/compat'
import { Button, DEFAULT_INPUT_PADDING, DEFAULT_INPUT_UNSTYLED, Dialog, Dots, Typography, classNames } from '@zenlink-interface/ui'
import { useSetCodeReview } from '@zenlink-interface/wagmi'
import { REFERRALS_ENABLED_NETWORKS } from 'config'
import { formatBytes32String } from 'ethers/lib/utils.js'
import type { Dispatch, FC, SetStateAction } from 'react'
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
    <Dialog open={open} onClose={() => setOpen(false)}>
      <Dialog.Content className="max-w-sm !pb-2">
        <Dialog.Header border={false} title="Enter Referral Code" onClose={() => setOpen(false)} />
        <div className="flex flex-col p-2 gap-4">
          <div className="ring-offset-2 ring-offset-slate-200 dark:ring-offset-slate-800 flex gap-2 bg-slate-300 dark:bg-slate-700 pr-3 w-full relative items-center justify-between rounded-2xl focus-within:ring-2 text-primary ring-blue">
            <input
              value={inputCode}
              placeholder="zenlink"
              className={classNames(DEFAULT_INPUT_UNSTYLED, DEFAULT_INPUT_PADDING)}
              type="text"
              onInput={e => setInputCode(e.currentTarget.value)}
            />
          </div>
          <div className="w-full">
            <Checker.Connected chainId={chainId} fullWidth size="default">
              <Checker.Network fullWidth size="default" chainId={chainId}>
                <Button
                  fullWidth
                  onClick={() => sendTransaction?.()}
                  disabled={
                    !inputCode
                    || isInputOwnedCodes
                    || isWritePending
                    || !chainId
                    || !REFERRALS_ENABLED_NETWORKS.includes(chainId)
                  }
                  size="default"
                >
                  {!inputCode
                    ? 'Enter a code'
                    : isInputOwnedCodes
                      ? 'No self-referral'
                      : isWritePending
                        ? <Dots>Confirm submit</Dots>
                        : 'Submit'
                  }
                </Button>
              </Checker.Network>
            </Checker.Connected>
          </div>
        </div>
        {error && (
          <Typography variant="xs" className="mt-4 text-center text-red" weight={500}>
            {error}
          </Typography>
        )}
      </Dialog.Content>
    </Dialog>
  )
}
