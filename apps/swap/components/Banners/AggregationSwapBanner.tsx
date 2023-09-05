import { useSettings } from '@zenlink-interface/shared'
import { AppearOnMount, Button, IconButton, Link, Typography, classNames, useBreakpoint } from '@zenlink-interface/ui'
import { CpuChipIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { type FC, useCallback } from 'react'
import { Trans } from '@lingui/macro'

export const AggregationSwapBanner: FC = () => {
  const [{ hideAggregationSwapBanner }, { updateHideAggregationSwapBanner }] = useSettings()

  const toggleHideAggregationSwapBanner = useCallback(() => {
    updateHideAggregationSwapBanner(true)
  }, [updateHideAggregationSwapBanner])

  const shouldDisplay = Boolean(!hideAggregationSwapBanner)
  const { isMd } = useBreakpoint('md')

  const openWiki = () => {
    window.open('https://wiki.zenlink.pro/zenlink-dex-dapp/aggregator')
  }

  return (
    <AppearOnMount
      className={classNames(
        'w-[unset] h-[144px] bg-white dark:bg-[#0f172a] fixed bottom-[20px] right-[10px] rounded-2xl overflow-hidden shadow',
        'max-md:left-[10px] md:right-[20px] md:w-[390px] md:h-[164px]',
      )}
      show={shouldDisplay}
    >
      <div className="flex flex-col gap-3 w-full h-full p-[24px_16px_16px] bg-gradient-to-r from-blue/20 to-pink/20">
        <span className="text-base font-semibold tracking-tighter saturate-200 flex items-center gap-2 bg-gradient-to-r from-blue to-pink bg-clip-text text-transparent">
          <CpuChipIcon width={20} height={20} className="text-blue" />
          <Trans>Aggregation Swap</Trans>
        </span>
        <div className="absolute right-2 top-2">
          <IconButton onClick={toggleHideAggregationSwapBanner}>
            <XCircleIcon width={24} height={24} className="cursor-pointer text-slate-500 hover:text-slate-600 dark:hover:text-slate-300" />
          </IconButton>
        </div>
        <Typography variant="base" weight={400} className="text-slate-600 dark:text-slate-400">
          <Trans>
            Facilitate cost-efficient and secure swap transactions across multiple liquidity sources.
          </Trans>
          {!isMd && (
            <Link.External href="https://wiki.zenlink.pro/zenlink-dex-dapp/aggregator" className="text-blue">
              {' '}<Trans>Learn more</Trans>
            </Link.External>
          )}
        </Typography>
        <Button
          size="sm"
          variant="empty"
          className="hidden md:flex w-[144px] bg-white dark:bg-slate-700 !text-black dark:!text-white hover:bg-blue-200 dark:hover:bg-blue-600 rounded-2xl"
          onClick={openWiki}
        >
          <Trans>Learn more</Trans>
        </Button>
      </div>
    </AppearOnMount>
  )
}
