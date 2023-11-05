import { Trans, t } from '@lingui/macro'
import type { ParachainId } from '@zenlink-interface/chain'
import { Checker } from '@zenlink-interface/compat'
import { Button, DEFAULT_INPUT_PADDING, DEFAULT_INPUT_UNSTYLED, Dialog, Dots, Typography, classNames } from '@zenlink-interface/ui'
import { useCodeCheck, useGenerateCodeReview } from '@zenlink-interface/wagmi'
import { REFERRALS_ENABLED_NETWORKS } from 'config'
import type { Dispatch, FC, SetStateAction } from 'react'
import { useCallback, useState } from 'react'

interface GenerateCodeModalProps {
  chainId?: ParachainId
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export const GenerateCodeModal: FC<GenerateCodeModalProps> = ({
  chainId,
  open,
  setOpen,
}) => {
  const [inputCode, setInputCode] = useState('')
  const [error, setError] = useState<string>()

  const onSuccess = useCallback(() => {
    setInputCode('')
  }, [])

  const { data: { alreadyTaken }, isLoading } = useCodeCheck({
    chainId,
    code: inputCode,
    enabled: chainId && REFERRALS_ENABLED_NETWORKS.includes(chainId) && open,
  })
  const { isWritePending, sendTransaction } = useGenerateCodeReview({
    chainId,
    code: inputCode,
    open,
    setOpen,
    onSuccess,
    setError,
  })

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <Dialog.Content className="max-w-sm !pb-2">
        <Dialog.Header border={false} title={<Trans>Generate Referral Code</Trans>} onClose={() => setOpen(false)} />
        <div className="flex flex-col p-2 gap-4">
          <div className="ring-offset-2 ring-offset-slate-100 dark:ring-offset-slate-800 flex gap-2 bg-slate-200 dark:bg-slate-700 pr-3 w-full relative items-center justify-between rounded-2xl focus-within:ring-2 text-primary ring-blue">
            <input
              value={inputCode}
              placeholder={t`Enter a code`}
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
                  disabled={!inputCode || alreadyTaken || isLoading || isWritePending}
                  size="default"
                >
                  {!inputCode
                    ? <Trans>Enter a code</Trans>
                    : isLoading
                      ? <Dots><Trans>Checking code</Trans></Dots>
                      : alreadyTaken
                        ? <Trans>Code already taken</Trans>
                        : isWritePending
                          ? <Dots><Trans>Confirm generate</Trans></Dots>
                          : <Trans>Generate</Trans>}
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
