import { Layout } from 'components'
import { Trans } from '@lingui/macro'
import { Button } from '@zenlink-interface/ui'
import { LockClosedIcon } from '@heroicons/react/24/solid'

function Gauge() {
  return (
    <Layout>
      <div className="flex flex-col gap-10 md:gap-16">
        <section className="flex flex-col gap-6 lg:flex-row">
          <div className="max-w-lg space-y-4">
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
      </div>
    </Layout>
  )
}

export default Gauge
