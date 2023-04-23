import * as React from 'react'

export const StatemineNaked = (props: React.ComponentProps<'svg'>) => (
<svg
    xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      fill="none"
      viewBox="0 0 200 200"
      {...props}
    >
      <circle cx="100" cy="100" r="100" fill="#000"></circle>
      <g fill="#fff">
        <path d="M58.13 75.51c-4.901-18.294 5.955-37.098 24.248-42l8.876 33.124 8.875 33.123c-18.293 4.902-37.097-5.954-41.998-24.248zM142.006 124.248c4.902 18.294-5.954 37.097-24.248 41.999l-8.875-33.124L100.007 100c18.294-4.902 37.097 5.954 41.999 24.248zM69.229 166.209c-13.392-13.392-13.392-35.104 0-48.496l24.248 24.248 24.248 24.248c-13.392 13.392-35.105 13.392-48.496 0z"></path>
        <path d="M130.752 33.752c13.392 13.392 13.392 35.105 0 48.496L106.504 58 82.256 33.752c13.392-13.391 35.104-13.391 48.496 0z"></path>
      </g>
  </svg>
)
