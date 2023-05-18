import RcTooltip from 'rc-tooltip'
import type { TooltipProps } from 'rc-tooltip/lib/Tooltip'
import type { FC, ReactElement } from 'react'

interface ExtendTooltipProps extends Omit<TooltipProps, 'overlay' | 'arrowContent'> {
  button: ReactElement
  panel: ReactElement
  naked?: boolean
}

export const Tooltip: FC<ExtendTooltipProps> = ({
  button,
  panel,
  placement = 'top',
  mouseEnterDelay = 0,
  naked,
  ...props
}) => {
  const offset = [0, 0]
  if (placement?.includes('left'))
    offset[0] -= 12

  if (placement?.includes('top'))
    offset[1] -= 12

  if (placement?.includes('bottom'))
    offset[1] += 12

  if (placement?.includes('right'))
    offset[0] += 12

  return (
    <RcTooltip
      {...(naked && { overlayInnerStyle: { padding: 0 } })}
      motion={{ motionName: 'rc-tooltip-zoom' }}
      mouseEnterDelay={mouseEnterDelay}
      align={{ offset }}
      overlay={panel}
      placement={placement}
      {...props}
    >
      {button}
    </RcTooltip>
  )
}
