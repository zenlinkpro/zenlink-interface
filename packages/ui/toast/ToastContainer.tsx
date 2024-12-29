import type { FC } from 'react'

import { ToastContainer as ToastifyContainer } from 'react-toastify'

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
