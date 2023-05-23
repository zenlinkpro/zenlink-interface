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

  const { x, y, refs, floatingStyles, context } = useFloating({
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

  const hover = useHover(context, { move: false })
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
      transform: 'scale(0.8)',
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
              left: x ?? 0,
              top: y ?? 0,
            }}
            {...getFloatingProps()}
            className={classNames('z-[9998] rounded-xl border border-slate-400 dark:border-slate-700 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.20)]', className)}
          >
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-medium px-2.5 py-2 text-xs leading-normal">
              {content}
            </div>
            <FloatingArrow
              strokeWidth={1}
              className="fill-slate-50 dark:fill-slate-800 [&>path:first-of-type]:stroke-slate-400 dark:[&>path:first-of-type]:stroke-slate-700 [&>path:last-of-type]:stroke-slate-50 dark:[&>path:last-of-type]:stroke-slate-800"
              ref={arrowRef}
              context={context}
            />
          </div>
        </FloatingPortal>
      )}
    </>
  )
}
