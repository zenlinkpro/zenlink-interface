import { Layout } from 'components'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const { chainId, referralCode } = query
  return {
    props: {
      chainId: chainId ?? null,
      referralCode: referralCode ?? null,
    },
  }
}

function Referrals(initialState: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <div className="flex flex-col gap-10 md:gap-16">
        <section className="flex flex-col gap-6 lg:flex-row">
          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-semibold text-slate-50">Referrals</h2>
            <p className="text-slate-300">Get fee discounts and earn rebates through the referral program.</p>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default Referrals
