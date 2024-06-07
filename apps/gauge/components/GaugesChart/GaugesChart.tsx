import { Tab } from '@headlessui/react'
import { Trans } from '@lingui/macro'
import { Typography, classNames } from '@zenlink-interface/ui'
import { ChartMode, useGaugeVotes } from 'components'
import { TAB_DEFAULT_CLASS, TAB_NOT_SELECTED_CLASS, TAB_SELECTED_CLASS } from 'lib/constants'
import { type FC, useEffect, useState } from 'react'

import { VotePercentChart } from './VotePercentChart'

export const GaugesChart: FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { chartMode, setChartMode } = useGaugeVotes()

  const isCommunityChart = chartMode === ChartMode.COMMUNITY_VOTE

  useEffect(() => {
    if (isCommunityChart)
      setSelectedIndex(0)
    else
      setSelectedIndex(1)
  }, [isCommunityChart])

  return (
    <section>
      <Tab.Group onChange={setSelectedIndex} selectedIndex={selectedIndex}>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
          <Typography variant="base" weight={600}>
            {isCommunityChart ? <Trans>Community Vote Summary</Trans> : <Trans>My Vote Summary</Trans>}
          </Typography>
          <Tab.List className="flex max-w-sm space-x-1 rounded-full bg-blue-900/20 p-1">
            <Tab
              className={({ selected }) =>
                classNames(
                  selected ? TAB_SELECTED_CLASS : TAB_NOT_SELECTED_CLASS,
                  TAB_DEFAULT_CLASS,
                )}
              onClick={() => setChartMode(ChartMode.COMMUNITY_VOTE)}
            >
              <Trans>Community</Trans>
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  selected ? TAB_SELECTED_CLASS : TAB_NOT_SELECTED_CLASS,
                  TAB_DEFAULT_CLASS,
                )}
              onClick={() => setChartMode(ChartMode.MY_VOTE)}
            >
              <Trans>My Vote</Trans>
            </Tab>
          </Tab.List>
        </div>
        <VotePercentChart />
      </Tab.Group>
    </section>
  )
}
