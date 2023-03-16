import { useIsMounted } from '@zenlink-interface/hooks'
import { classNames } from '@zenlink-interface/ui'
import type { FC, ReactNode } from 'react'
import { useMemo } from 'react'
import { TokenApproveButton } from './TokenApproveButton'

interface Props {
  className?: string
  render({ isUnknown, approved }: { approved: boolean | undefined; isUnknown: boolean | undefined }): ReactNode
}

const Controller: FC<Props> = ({ className, render }) => {
  const isMounted = useIsMounted()

  const button = useMemo(() => {
    return render({ approved: true, isUnknown: false })
  }, [render])

  if (!isMounted)
    return <>{render({ approved: true, isUnknown: true })}</>

  return (
    <div className={classNames(className, 'flex flex-col justify-center items-center w-full')}>
      {button}
    </div>
  )
}

export const Approve: typeof Controller & {
  Token: typeof TokenApproveButton
} = Object.assign(Controller, {
  Token: TokenApproveButton,
})
