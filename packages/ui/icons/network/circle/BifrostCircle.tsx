import * as React from 'react'

export const BifrostCircle = (props: React.ComponentProps<'svg'>) => (
  <svg width="128px" height="128px" viewBox="0 0 128 128" {...props} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient x1="50.0001183%" y1="0%" x2="50.0001183%" y2="100%" id="linearGradient-bifrost-chain-icon">
        <stop stopColor="#7AEDCF" offset="0%"></stop>
        <stop stopColor="#68CEFA" offset="20.1333%"></stop>
        <stop stopColor="#689CF8" offset="40.3244%"></stop>
        <stop stopColor="#AC57C0" offset="60.2076%"></stop>
        <stop stopColor="#E65659" offset="80.1867%"></stop>
        <stop stopColor="#F2C241" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(-1234.000000, -817.000000)">
        <g transform="translate(1234.000000, 817.000000)">
          <g></g>
          <polygon fill="url(#linearGradient-bifrost-chain-icon)" fillRule="nonzero" points="101.844509 34.9288727 82.9354772 34.9288727 26.2081455 93.1106909 64.0264454 93.1106909"></polygon>
        </g>
      </g>
    </g>
  </svg>
)
