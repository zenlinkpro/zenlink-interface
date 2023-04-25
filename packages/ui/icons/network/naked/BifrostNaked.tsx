import * as React from 'react'

export const BifrostNaked = (props: React.ComponentProps<'svg'>) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M0 50C0 22.3858 22.3858 0 50 0V0C77.6142 0 100 22.3858 100 50V50C100 77.6142 77.6142 100 50 100V100C22.3858 100 0 77.6142 0 50V50Z" />
    <g clipPath="url(#clip0)">
      <path
        d="M50 72.3684H19.7368L65.1316 26.9736H80.2631L50 72.3684Z"
        fill="url(#paint0_linear)"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear"
        x1={50}
        y1={26.9736}
        x2={50}
        y2={72.3684}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#7AEDCF" />
        <stop offset={0.201333} stopColor="#68CEFA" />
        <stop offset={0.403244} stopColor="#689CF8" />
        <stop offset={0.602076} stopColor="#AC57C0" />
        <stop offset={0.801867} stopColor="#E65659" />
        <stop offset={1} stopColor="#F2C241" />
      </linearGradient>
      <clipPath id="clip0">
        <rect
          width={60.5263}
          height={45.3947}
          fill="white"
          transform="translate(19.7368 26.9736)"
        />
      </clipPath>
    </defs>
  </svg>
)
