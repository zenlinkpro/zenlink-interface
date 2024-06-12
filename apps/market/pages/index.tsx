import { Layout, MarketsFiltersProvider, MarketsSection } from 'components'
import { Trans } from '@lingui/macro'

function Markets() {
  return (
    <Layout maxWidth="6xl">
      <div className="flex flex-col gap-10 md:gap-16">
        <section className="flex flex-col gap-6 lg:flex-row">
          <div className="max-w-lg space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              <Trans>Market</Trans>
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              <Trans>All yield is streamed to YT until maturity.</Trans>
              <br />
              <Trans>PT can be redeemed for the underlying asset after maturity.</Trans>
            </p>
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
