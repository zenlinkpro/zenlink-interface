import type { FC } from 'react'

import type { LoaderProps } from './types'

/**
 * Takes in custom size and stroke for circle color, default to primary color as fill,
 * need ...rest for layered styles on top
 */
export const Loader: FC<LoaderProps> = ({ size = 16 }) => {
  return (
    <svg
      className="animate-spin"
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="7"
        cy="7"
        r="6"
        stroke="currentColor"
        strokeWidth="2"
        className="text-gray-400 dark:text-white/[0.12]"
      />
      <path
        d="M7 1C8.04257 1 9.06714 1.27166 9.97275 1.78821C10.8784 2.30476 11.6337 3.04837 12.1645 3.94575C12.6952 4.84313 12.9829 5.86332 12.9993 6.90576C13.0156 7.9482 12.7601 8.97691 12.2578 9.89052"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-slate-200"
      />
    </svg>
  )
}
