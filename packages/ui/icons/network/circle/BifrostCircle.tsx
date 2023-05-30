import * as React from 'react'

export const BifrostCircle = (props: React.ComponentProps<'svg'>) => (
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      d="M64 32C64 14.327 49.673 0 32 0 14.327 0 0 14.327 0 32c0 17.673 14.327 32 32 32 17.673 0 32-14.327 32-32Z"
    />
    <linearGradient
      id="a"
      x1={32.393}
      y1={17.263}
      x2={32.393}
      y2={46.316}
      gradientUnits="userSpaceOnUse"
    >
      <stop offset={0} stopColor="#7aedcf" />
      <stop offset={0.201} stopColor="#68cefa" />
      <stop offset={0.403} stopColor="#689cf8" />
      <stop offset={0.602} stopColor="#ac57c0" />
      <stop offset={0.802} stopColor="#e65659" />
      <stop offset={1} stopColor="#f2c241" />
    </linearGradient>
    <path
      fill="url(#a)"
      d="M32.393 46.316H12.787l29.409-29.053h9.803L32.393 46.316Z"
    />
  </svg>
)
