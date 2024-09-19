import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Link } from '@zenlink-interface/ui'
import { Layout, MarketsFiltersProvider, MarketsSection } from 'components'

function Markets() {
  return (
    <Layout maxWidth="6xl">
      <div className="flex flex-col gap-10 md:gap-16">
        <section className="flex flex-col gap-6 lg:flex-row">
          <div className="max-w-xl space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              <Trans>Eden</Trans>
            </h2>
            <div className="flex flex-col text-slate-700 dark:text-slate-300">
              <Trans>All yield is streamed to YT until maturity.</Trans>
              <div className="flex items-baseline gap-1">
                <Trans>PT can be redeemed for the underlying asset after maturity.</Trans>
                <Link.External
                  className="text-sm font-medium gap-1 underline"
                  color="blue"
                  endIcon={<ArrowTopRightOnSquareIcon className="text-blue" height={20} width={20} />}
                  href="https://wiki.zenlink.pro/zenlinkeden/introduction"
                >
                  Learn more
                </Link.External>
              </div>
            </div>
          </div>
          <div className="flex justify-end flex-grow not-prose">
          </div>
        </section>
        <MarketsFiltersProvider>
          <MarketsSection />
        </MarketsFiltersProvider>
      </div>
    </Layout>
  )
}

export default Markets
