import 'react-toastify/dist/ReactToastify.css'

import type { FC } from 'react'
import { ToastContainer as ToastifyContainer } from 'react-toastify'

interface ToastContainerProps {
  className?: string
}

export const ToastContainer: FC<ToastContainerProps> = ({ className }) => {
  return (
    <ToastifyContainer
      bodyClassName={
        () => 'mx-4 flex flex-col ring-1 border border-slate-500/20 ring-white/20 dark:ring-black/20 bg-white dark:bg-slate-800 shadow-md mt-4 md:mt-2 rounded-xl overflow-hidden'
      }
      className={className}
      newestOnTop
      toastClassName={() => ''}
    />
  )
}
