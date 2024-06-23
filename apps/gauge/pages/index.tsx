import { LockClosedIcon } from '@heroicons/react/24/solid'
import { Trans } from '@lingui/macro'
import { Button } from '@zenlink-interface/ui'
import { GaugeVotesProvider, GaugesChart, GaugesSection, Layout, VeDashboard } from 'components'

function Gauge() {
  return (
    <Layout maxWidth="7xl">
      <div className="flex flex-col gap-10 md:gap-16">
        <section className="flex flex-col gap-6 lg:flex-row">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              <Trans>Gauge</Trans>
            </h2>
            <p className="text-slate-700 dark:text-slate-300 text-sm">
              <Trans>veZLK enables protocol governance by allowing ZLK holders to channel protocol incentives to desired pools.</Trans>
              <br />
              <Trans>View and cast your veZLK votes from this page. Select your desired pool and enter the quantity of veZLK votes you wish to cast.</Trans>
            </p>
          </div>
          <div className="flex items-center justify-end flex-grow not-prose">
            <div className="flex flex-col gap-3 w-full lg:w-[200px]">
              <Button as="a" color="blue" fullWidth href="/gauge/lock" startIcon={<LockClosedIcon height={16} width={16} />}>
                <Trans>Lock</Trans>
              </Button>
            </div>
          </div>
        </section>
        <VeDashboard />
        <div className="flex flex-col lg:grid lg:grid-cols-[720px_auto] gap-16">
          <GaugeVotesProvider>
            <div className="flex flex-col order-1 gap-9">
              <GaugesSection />
            </div>
            <div className="flex flex-col order-2 gap-4">
              <div className="p-6 rounded-xl border border-slate-500/50 bg-white/50 dark:bg-slate-700/50">
                <GaugesChart />
              </div>
            </div>
          </GaugeVotesProvider>
        </div>
      </div>
    </Layout>
  )
}

export default Gauge
