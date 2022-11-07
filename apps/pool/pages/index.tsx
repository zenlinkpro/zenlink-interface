import { Layout } from 'components'

function Pools() {
  return (
    <Layout>
      <div className="flex flex-col gap-10 md:gap-16">
        <section className="flex flex-col gap-6 lg:flex-row">
          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-semibold text-slate-50">Pool</h2>
            <p className="text-slate-300">Earn fees by providing liquidity.</p>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default Pools
