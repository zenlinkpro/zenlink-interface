import type { FC } from 'react'

import { ToastContainer as ToastifyContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface ToastContainerProps {
  className?: string
}

export const ToastContainer: FC<ToastContainerProps> = ({ className }) => {
  return (
    <ToastifyContainer
      className={className}
      newestOnTop
      toastClassName={() => ''}
    />
  )
}
