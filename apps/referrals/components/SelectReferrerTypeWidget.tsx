import { Widget } from '@zenlink-interface/ui'
import { Disclosure } from '@headlessui/react'
import type { FC } from 'react'
import { memo } from 'react'

export const SelectReferrerTypeWidget: FC = memo(() => {
  return (
    <Widget id="selectReferrerType" maxWidth={460} className="!bg-slate-800">
      <Widget.Content>
        <Disclosure>
          {() => (
            <>

            </>
          )}
        </Disclosure>
      </Widget.Content>
    </Widget>
  )
})
