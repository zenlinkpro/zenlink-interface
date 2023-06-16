import { CopyHelper, IconButton, Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { CheckIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import type { CellProps } from './types'

export const CodeCell: FC<CellProps> = ({ row }) => {
  return (
    <div className="flex items-center gap-2">
      <Typography variant="sm" weight={500} className="text-slate-800 dark:text-slate-200 flex gap-2 items-center">
        {row.id}
      </Typography>
      <CopyHelper toCopy={`https://manta-dex-app.vercel.app/referrals?chainId=${row.chainId}&referralCode=${row.code}`} hideIcon>
        {isCopied => (
          <IconButton className="p-0.5">
            {isCopied
              ? <CheckIcon className="text-green" width={18} height={18} />
              : <DocumentDuplicateIcon width={18} height={18} />
            }
          </IconButton>
        )}
      </CopyHelper>
    </div>
  )
}
