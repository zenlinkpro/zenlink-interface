import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Trans } from '@lingui/macro'
import { usePrevious } from '@zenlink-interface/hooks'
import { useSettings } from '@zenlink-interface/shared'
import { Typography, Widget } from '@zenlink-interface/ui'
import { AffiliatesSection, Layout, SelectReferrerTypeWidget, TradersSection } from 'components'
import { DiscountTable } from 'components/DiscountTable'
import { ZLK_DISCOUNT_ENABLED_NETWORKS } from 'config'
import { useDiscountTiers } from 'lib/hooks'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

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

export enum ReferrerType {
  Traders,
  Affiliates,
}

function Referrals(initialState: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const [initialReferralCode, setInitialCode] = useState<string>(initialState.referralCode || '')
  const [{ parachainId }] = useSettings()
  const queryChainId = router.query.chainId ? Number(router.query.chainId) : undefined
  const chainId = queryChainId || parachainId
  const previousChainId = usePrevious(chainId)
  const discountTiers = useDiscountTiers(chainId)

  useEffect(() => {
    if (
      previousChainId
      && chainId !== previousChainId
      && chainId !== Number(router?.query?.chainId)
    ) {
      // Clear up the query string if user changes network
      // whilst there is a chainId parameter in the query...
      delete router.query.chainId
      router.replace(
        {
          pathname: router.pathname,
          query: router.query,
        },
        undefined,
        { shallow: true },
      )
    }
  }, [router, previousChainId, chainId])

  const [referrerType, setReferrerType] = useState(ReferrerType.Traders)

  return (
    <Layout>
      <div className="flex flex-col gap-10 md:gap-16">
        <section className="flex flex-col gap-6 lg:flex-row">
          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              <Trans>Referrals</Trans>
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              <Trans>Get fee discounts and earn rebates through the referral program.</Trans>
            </p>
          </div>
        </section>
        <div className="flex flex-col items-center">
          <Widget className="dark:!bg-slate-800" id="referrals" maxWidth={480}>
            <Widget.Content>
              <SelectReferrerTypeWidget referrerType={referrerType} setReferrerType={setReferrerType} />
              <>
                {referrerType === ReferrerType.Affiliates && <AffiliatesSection chainId={chainId} />}
                {referrerType === ReferrerType.Traders && (
                  <TradersSection
                    chainId={chainId}
                    initialReferralCode={initialReferralCode}
                    setInitialCode={setInitialCode}
                  />
                )}
              </>
            </Widget.Content>
          </Widget>
          {ZLK_DISCOUNT_ENABLED_NETWORKS.includes(chainId) && (
            <div className="w-full max-w-[480px] flex flex-col gap-2 mt-8">
              <div className="pl-4">
                <Typography className="text-slate-700 dark:text-slate-300" weight={600}>
                  <Trans>Trading fee discount</Trans>
                </Typography>
                <Typography className="text-slate-700 dark:text-slate-300" variant="xs">
                  <Trans>Calculate based on ZLK holdings.</Trans>
                </Typography>
              </div>
              <DiscountTable data={discountTiers} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Referrals
