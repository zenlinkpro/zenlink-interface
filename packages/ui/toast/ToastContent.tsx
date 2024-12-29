import type { FC, ReactNode } from 'react'

import { Typography } from '../typography'

interface ToastContentProps {
  icon?: ReactNode
  title: ReactNode | string
  summary: ReactNode | Array<ReactNode>
  code?: boolean
}

export const ToastContent: FC<ToastContentProps> = ({ icon, title, summary, code = false }) => {
  return (
    <div className="p-4 flex gap-4 items-start">
      {icon && <div className="mt-0.5">{icon}</div>}
      <div className="flex flex-col gap-1 w-[240px]">
        <Typography className="text-slate-900 dark:text-slate-50" variant="sm" weight={500}>
          {title}
        </Typography>
        {!code
          ? (
              <Typography className="text-slate-800 dark:text-slate-200" variant="xs">
                {summary}
              </Typography>
            )
          : (
              <div className="scroll mt-2 bg-white/20 dark:bg-black/20 p-2 px-3 rounded-lg border border-slate-800/10 dark:border-slate-200/10 text-[10px] text-slate-800 dark:text-slate-200 break-all max-h-[80px] overflow-y-auto">
                <code>{summary}</code>
              </div>
            )}
      </div>
    </div>
  )
}
