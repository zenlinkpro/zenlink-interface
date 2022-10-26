import 'react-toastify/dist/ReactToastify.css'

import type { FC } from 'react'
import { ToastContainer as ToastifyContainer } from 'react-toastify'

interface ToastContainerProps {
  className?: string
}

export const ToastContainer: FC<ToastContainerProps> = ({ className }) => {
  return (
    <ToastifyContainer
      newestOnTop
      bodyClassName={() =>
        // 'mx-4 flex flex-col bg-dark-700 ring-1 ring-black/20 bg-slate-800 shadow-md mt-4 md:mt-2 rounded-xl overflow-hidden'
        'mx-4 flex flex-col ring-1 ring-black/20 bg-slate-800 shadow-md mt-4 md:mt-2 rounded-xl overflow-hidden'
      }
      toastClassName={() => ''}
      className={className}
    />
  )
}
