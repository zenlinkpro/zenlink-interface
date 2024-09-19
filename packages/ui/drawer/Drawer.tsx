import type {
  Dispatch,
  FC,
  MouseEventHandler,
  ReactNode,
  SetStateAction,
} from 'react'
import type { ButtonComponent } from '../button'
import { Transition, TransitionChild } from '@headlessui/react'
import { useIsMounted } from '@zenlink-interface/hooks'
import classNames from 'classnames'
import {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import ReactDOM from 'react-dom'

interface DrawerContextProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  element: HTMLDivElement | null
}

const DrawerContext = createContext<DrawerContextProps | undefined>(undefined)

interface ProviderProps {
  children: ReactNode
}

export const DrawerRoot: FC<ProviderProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [, setRender] = useState(false)

  // Force render
  useEffect(() => {
    if (ref.current)
      setRender(true)
  }, [])

  return <DrawerContext.Provider value={{ element: ref?.current, open, setOpen }}>{children}</DrawerContext.Provider>
}

export function useDrawer() {
  const context = useContext(DrawerContext)
  if (!context)
    throw new Error('Hook can only be used inside Drawer Context')

  return context
}

interface PanelProps {
  children: ReactNode
  className?: string
}

export const DrawerButton: ButtonComponent = (props) => {
  const { setOpen } = useDrawer()

  const onClick = useCallback<MouseEventHandler<HTMLDivElement>>(
    (e) => {
      setOpen(prev => !prev)
      props.onClick && props.onClick(e)
    },
    [props, setOpen],
  )

  return <div className="flex items-center" onClick={onClick} {...props} />
}

export const Panel: FC<PanelProps> = ({ children, className }) => {
  const { open, setOpen } = useDrawer()
  const isMounted = useIsMounted()

  if (!isMounted)
    return <></>

  return ReactDOM.createPortal(
    <Transition appear as={Fragment} show={open} unmount={false}>
      <div className={classNames(className, 'fixed right-0 top-0 bottom-0 w-full translate-x-[100%] z-[1080] ')}>
        <TransitionChild
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          unmount={false}
        >
          <div
            aria-hidden="true"
            className="translate-x-[-100%] absolute inset-0 bg-black/40 transition-opacity"
            onClick={() => setOpen(false)}
          />
        </TransitionChild>
        <TransitionChild
          as="div"
          className="w-full sm:w-[380px] bg-gray-100 dark:bg-slate-900 overflow-y-auto scroll top-0 bottom-0 absolute px-5 shadow-xl shadow-black/30 border-l border-slate-200/10"
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-0"
          enterTo="translate-x-[-100%]"
          leave="transform transition ease-in-out duration-500"
          leaveFrom="translate-x-[-100%]"
          leaveTo="translate-x-0"
          unmount={false}
        >
          {children}
        </TransitionChild>
      </div>
    </Transition>,
    document.body,
  )
}

export const Drawer = { Root: DrawerRoot, Panel, Button: DrawerButton }
