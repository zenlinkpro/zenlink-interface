import type { FC, ReactElement } from 'react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

import { FromBottom, type FromBottomProps } from './FromBottom'
import { FromLeft, type FromLeftProps } from './FromLeft'
import { FromRight, type FromRightProps } from './FromRight'
import { FromTop, type FromTopProps } from './FromTop'

interface RootProps {
  children: ReactElement | Array<ReactElement>
}

const SlideInContext = createContext<HTMLElement | null | undefined>(undefined)

export const Root: FC<RootProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [render, setRender] = useState(false)

  useEffect(() => {
    if (ref.current)
      setRender(true)
  }, [])

  return (
    <SlideInContext.Provider value={ref?.current}>
      {render && children}
      <div ref={ref} />
    </SlideInContext.Provider>
  )
}

export function useSlideInContext() {
  return useContext(SlideInContext)
}

export const SlideIn: FC<RootProps> & {
  FromLeft: FC<FromLeftProps>
  FromRight: FC<FromRightProps>
  FromBottom: FC<FromBottomProps>
  FromTop: FC<FromTopProps>
} = Object.assign(Root, {
  FromLeft,
  FromRight,
  FromBottom,
  FromTop,
})
