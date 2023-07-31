import classNames from 'classnames'
import type { FC, ReactNode } from 'react'
import { useRef, useState } from 'react'
import type { Placement } from '@floating-ui/react'
import {
  FloatingArrow,
  FloatingPortal,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react'

interface TooltipProps {
  children: ReactNode
  placement?: Placement
  content: ReactNode
  className?: string
}

export const Tooltip: FC<TooltipProps> = ({ children, content, placement = 'top', className }) => {
  const [open, setOpen] = useState(false)
  const arrowRef = useRef(null)

  const { refs, floatingStyles, context } = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    middleware: [
      offset(15),
      flip(),
      shift(),
      arrow({
        element: arrowRef,
      }),
    ],
    whileElementsMounted: autoUpdate,
  })

  const hover = useHover(context, { delay: 100 })
  const click = useClick(context, { ignoreMouse: true })
  const focus = useFocus(context)
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'tooltip' })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    click,
    focus,
    dismiss,
    role,
  ])

  const { isMounted, styles } = useTransitionStyles(context, {
    initial: {
      opacity: 0,
    },
  })

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()} className="relative z-10 cursor-pointer">
        {children}
      </div>
      {isMounted && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              ...styles,
            }}
            {...getFloatingProps()}
            className={classNames('z-[9998] rounded-xl border border-slate-300 dark:border-slate-700 shadow-dropdown', className)}
          >
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-medium px-2.5 py-2 text-xs leading-normal">
              {content}
            </div>
            <FloatingArrow
              strokeWidth={1}
              className="fill-slate-50 dark:fill-slate-800 [&>path:first-of-type]:stroke-slate-300 dark:[&>path:first-of-type]:stroke-slate-700 [&>path:last-of-type]:stroke-slate-50 dark:[&>path:last-of-type]:stroke-slate-800"
              ref={arrowRef}
              context={context}
            />
          </div>
        </FloatingPortal>
      )}
    </>
  )
}
