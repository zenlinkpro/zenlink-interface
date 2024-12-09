import type { FC, ReactNode } from 'react'
import classNames from 'classnames'
import { Children, cloneElement, isValidElement } from 'react'

export interface IconListProps {
  children: ReactNode
  iconWidth: number
  iconHeight: number
}

export const IconList: FC<IconListProps> = ({ children, iconWidth, iconHeight }) => {
  return (
    <div className="flex items-center">
      <div className={classNames('inline-flex space-x-[-17.5%]')}>
        {Children.map(children, (child) => {
          if (isValidElement(child)) {
            return (
              <div className="rounded-full inline-flex shadow-sm shadow-black ring-1 ring-black/10 z-10">
                {cloneElement(child, {
                  ...child.props || {},
                  // @ts-expect-error ignore
                  width: iconWidth || child.props.width,
                  // @ts-expect-error ignore
                  height: iconHeight || child.props.height,
                })}
              </div>
            )
          }
        })}
      </div>
    </div>
  )
}
