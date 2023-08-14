import * as React from 'react'

export const BifrostCircle = (props: React.ComponentProps<'svg'>) => (
  <svg width="152" height="152" viewBox="0 0 152 152" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M76 106H36L96 46H116L76 106Z" fill="url(#paint0_linear)" />
    <defs>
      <linearGradient id="paint0_linear" x1="76" y1="46" x2="76" y2="106" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7AEDCF" />
        <stop offset="0.201333" stopColor="#68CEFA" />
        <stop offset="0.403244" stopColor="#689CF8" />
        <stop offset="0.602076" stopColor="#AC57C0" />
        <stop offset="0.801867" stopColor="#E65659" />
        <stop offset="1" stopColor="#F2C241" />
      </linearGradient>
    </defs>
  </svg>
)
