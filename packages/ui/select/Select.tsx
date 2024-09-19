import type { FC, ReactElement } from 'react'
import type { ExtractProps } from '../types'
import type { SelectButtonProps } from './SelectButton'
import type { SelectLabelProps } from './SelectLabel'

import type { SelectOptionProps } from './SelectOption'
import type { SelectOptionsProps } from './SelectOptions'
import { Listbox, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { cloneElement, Fragment } from 'react'
import SelectButton from './SelectButton'
import SelectLabel from './SelectLabel'
import SelectOption from './SelectOption'
import SelectOptions from './SelectOptions'

type SelectProps = ExtractProps<typeof Listbox> & {
  button: ReactElement<SelectButtonProps>
  label?: ReactElement<ExtractProps<typeof Listbox.Label>>
  children: ReactElement<ExtractProps<typeof Listbox.Options>>
}

const SelectRoot: FC<SelectProps> = ({
  className,
  value,
  onChange,
  disabled,
  horizontal,
  button,
  multiple,
  children,
  label,
}) => {
  return (
    <Listbox disabled={disabled} horizontal={horizontal} multiple={multiple} onChange={onChange} value={value}>
      {({ open }: { open: boolean }) => (
        <div className={classNames('space-y-2 flex flex-col gap-2', className)}>
          {label && label}
          <div className="relative">
            {cloneElement(button, { open })}
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-out duration-100"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
              show={open}
            >
              {children}
            </Transition>
          </div>
        </div>
      )}
    </Listbox>
  )
}

export const Select: FC<SelectProps> & {
  Button: FC<SelectButtonProps>
  Label: FC<SelectLabelProps>
  Option: FC<SelectOptionProps>
  Options: FC<SelectOptionsProps>
} = Object.assign(SelectRoot, {
  Button: SelectButton,
  Label: SelectLabel,
  Option: SelectOption,
  Options: SelectOptions,
})
