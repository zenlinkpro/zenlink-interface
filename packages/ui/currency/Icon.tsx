import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid'
import chains, { ParachainId } from '@zenlink-interface/chain'
import type { Currency } from '@zenlink-interface/currency'
import { WrappedTokenInfo } from '@zenlink-interface/token-lists'
import type { ImageProps } from 'next/legacy/image'
import Image from 'next/legacy/image'
import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'

import { GradientCircleIcon } from '../icons'
import { Link } from '../link'

const BLOCKCHAIN: Record<number, string> = {
  // [ParachainId.MOONBEAM]: 'moonbeam',
  // [ParachainId.MOONRIVER]: 'moonriver',
  // [ParachainId.ASTAR]: 'astar',
  // [ParachainId.BIFROST_KUSAMA]: 'bifrost',
  // [ParachainId.BIFROST_POLKADOT]: 'bifrost',
  // [ParachainId.ARBITRUM_ONE]: 'arbitrum',
}

const GlmrLogo = 'https://raw.githubusercontent.com/zenlinkpro/assets/master/blockchains/moonbeam/info/logo.png'
const MovrLogo = 'https://raw.githubusercontent.com/zenlinkpro/assets/master/blockchains/moonriver/info/logo.png'
const AstrLogo = 'https://raw.githubusercontent.com/zenlinkpro/assets/master/blockchains/astar/info/logo.png'
const BncKusamaLogo = 'https://raw.githubusercontent.com/zenlinkpro/assets/master/blockchains/bifrost/info/logo.png'
const EthereumLogo = 'https://raw.githubusercontent.com/zenlinkpro/assets/master/blockchains/ethereum/info/logo.png'
const CalamariLogo = 'https://raw.githubusercontent.com/Manta-Network/manta-chaindata/main/assets/tokens/KMA.svg'
const MantaLogo = 'https://raw.githubusercontent.com/Manta-Network/manta-chaindata/main/assets/tokens/MANTA.svg'

const LOGO: Record<number, string> = {
  // [ParachainId.MOONRIVER]: MovrLogo,
  // [ParachainId.MOONBEAM]: GlmrLogo,
  // [ParachainId.ASTAR]: AstrLogo,
  // [ParachainId.BIFROST_KUSAMA]: BncKusamaLogo,
  // [ParachainId.ARBITRUM_ONE]: EthereumLogo,
  [ParachainId.CALAMARI_KUSAMA]: CalamariLogo,
  // [ParachainId.MANTA_POLKADOT]: MantaLogo,
}

export interface IconProps extends Omit<ImageProps, 'src' | 'alt'> {
  currency: Currency
  disableLink?: boolean
}

export const Icon: FC<IconProps> = ({ currency, disableLink, ...rest }) => {
  const [error, setError] = useState(false)

  const src = useMemo(() => {
    if (currency.isNative)
      return LOGO[currency.chainId]

    if (currency instanceof WrappedTokenInfo && currency.logoURI)
      return currency.logoURI

    return `https://raw.githubusercontent.com/Manta-Network/manta-chaindata/main/assets/tokens/${currency.symbol}.svg`
  }, [currency])

  useEffect(() => {
    setError(false)
  }, [src])

  if (error) {
    return (
      <Link.External className="flex" href={chains[currency.chainId].getTokenUrl(currency.wrapped.address)}>
        <GradientCircleIcon width={rest.width} height={rest.height} />
      </Link.External>
    )
  }

  if (!src) {
    return (
      <QuestionMarkCircleIcon
        width={rest.width}
        height={rest.height}
        className="rounded-full bg-white bg-opacity-[0.12]"
      />
    )
  }

  if (disableLink) {
    return (
      <Image
        key={src}
        placeholder={rest?.width && rest?.height && Number(rest?.width) >= 40 && Number(rest?.height) >= 40 ? 'blur' : 'empty'}
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAADhUlEQVRIx6VXz48UVRD+qmb6DXhQNoYYsy6rrFGMUSCYrDvgwauJ2cOGMTHGmzcjuAZiSNCOgWhUMGjixT9AYCFkb8aDMSQLRpCbF91FZRFcLuuvDUq26/PQs83rntc9PdJJJ/XmVb/6ql59VTWCGs/u3WzIpp92NgWTrcTazrDZJTbkjHDGZZfwsktsLjLMPrjy/bnOTCfpd6ZUbU68vrh+aN3qnpZh2hk3uoRwRkSpQaytC/KNKMGRe2/9+Ulnpn1zYMPPHvylExmOOuNwzkCJwQCYxWiV0y/NbD0VOl97fiFlV7wYC+S4AsPKVEkBKAFhilZ8ubuX6ZJQckSFJ09PXXovjqnVHsfUp/Hr547sREm1h84sWwdD761bCU9c2Lb9xTgWC3q8Q68dFqAjBBRcQ57KIISEoPt6Hue8LUaDAIAXdn536Z1gqLcevtpR8M3MgBfGtYO0J6Sop5fuHzj73IWpnOEHji6uV8qHuQ8LH0vISKmeH5n0VVAUcuzi8xfvygxvuNnYK8SIIpA4JWD8QwsGKkBzmLeSV9PkOsnGEz9ev+7zNE0My+SonLM5uVKvu24Zl+bv/nlYt8z/tkvJjVpA7odUWfQ2H+4yvVAEQd73+PKmCRXhZI6LA3PWA3M7pJkTGSu6cpe/k9ok2mVGipmp/sHM08unXX/Q0lYQm8Nc7M3MzECNyJSDBpQcUyHvCad/Pc6WFpBSPULADdqXs+zH2aIR9la93LV0E1GIPyo5G+S2z9m8kZqgf1cFFsLpX56ZtQsNSiM4r2qcC6f/nXO2t3avRcXmVERn74yzRTA+Z72E9e5XKLM6uuX+cwLcqEr/XjD5+83X676gl0bPTnyjMx1J1HBEAvdb7Mfql9OanO0FLR8IxBQApLH6sQJX/PutxdkBuJ3q8mr0r32atcWv44f+AfiGEByIswgNByyremyAr42cTyfPbAL58tDoKRW8q31p4nO2tx9XgD708FftM8GZa3tr9KASJ3qKQrFdDsZZNCDHH3tmPO4zV1Nenr78dmR8yxnlfzX92zKbhvd3TDx1QLwJs3Kgf2XPwpQz+ygyjtQf6M3fu+IS2zv+xfiZegN99/ns2Njplb+ajwiwX4ElzXeXcD8moJAlBfatrvz9aJnRvv+dsjk/puLaD+1mYpOthG1HG3MJh7oeL0fGBWecW0fMfvvktvNxIayh5z//1nKmShHglAAAAABJRU5ErkJggg=="
        onErrorCapture={() => setError(true)}
        src={src}
        alt={currency.name || currency.wrapped.address}
        className="rounded-full"
        {...rest}
      />
    )
  }

  return (
    <Link.External className="flex" href={chains[currency.chainId].getTokenUrl(currency.wrapped.address)}>
      <Image
        key={src}
        placeholder={rest?.width && rest?.height && Number(rest?.width) >= 40 && Number(rest?.height) >= 40 ? 'blur' : 'empty'}
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAADhUlEQVRIx6VXz48UVRD+qmb6DXhQNoYYsy6rrFGMUSCYrDvgwauJ2cOGMTHGmzcjuAZiSNCOgWhUMGjixT9AYCFkb8aDMSQLRpCbF91FZRFcLuuvDUq26/PQs83rntc9PdJJJ/XmVb/6ql59VTWCGs/u3WzIpp92NgWTrcTazrDZJTbkjHDGZZfwsktsLjLMPrjy/bnOTCfpd6ZUbU68vrh+aN3qnpZh2hk3uoRwRkSpQaytC/KNKMGRe2/9+Ulnpn1zYMPPHvylExmOOuNwzkCJwQCYxWiV0y/NbD0VOl97fiFlV7wYC+S4AsPKVEkBKAFhilZ8ubuX6ZJQckSFJ09PXXovjqnVHsfUp/Hr547sREm1h84sWwdD761bCU9c2Lb9xTgWC3q8Q68dFqAjBBRcQ57KIISEoPt6Hue8LUaDAIAXdn536Z1gqLcevtpR8M3MgBfGtYO0J6Sop5fuHzj73IWpnOEHji6uV8qHuQ8LH0vISKmeH5n0VVAUcuzi8xfvygxvuNnYK8SIIpA4JWD8QwsGKkBzmLeSV9PkOsnGEz9ev+7zNE0My+SonLM5uVKvu24Zl+bv/nlYt8z/tkvJjVpA7odUWfQ2H+4yvVAEQd73+PKmCRXhZI6LA3PWA3M7pJkTGSu6cpe/k9ok2mVGipmp/sHM08unXX/Q0lYQm8Nc7M3MzECNyJSDBpQcUyHvCad/Pc6WFpBSPULADdqXs+zH2aIR9la93LV0E1GIPyo5G+S2z9m8kZqgf1cFFsLpX56ZtQsNSiM4r2qcC6f/nXO2t3avRcXmVERn74yzRTA+Z72E9e5XKLM6uuX+cwLcqEr/XjD5+83X676gl0bPTnyjMx1J1HBEAvdb7Mfql9OanO0FLR8IxBQApLH6sQJX/PutxdkBuJ3q8mr0r32atcWv44f+AfiGEByIswgNByyremyAr42cTyfPbAL58tDoKRW8q31p4nO2tx9XgD708FftM8GZa3tr9KASJ3qKQrFdDsZZNCDHH3tmPO4zV1Nenr78dmR8yxnlfzX92zKbhvd3TDx1QLwJs3Kgf2XPwpQz+ygyjtQf6M3fu+IS2zv+xfiZegN99/ns2Njplb+ajwiwX4ElzXeXcD8moJAlBfatrvz9aJnRvv+dsjk/puLaD+1mYpOthG1HG3MJh7oeL0fGBWecW0fMfvvktvNxIayh5z//1nKmShHglAAAAABJRU5ErkJggg=="
        onErrorCapture={() => setError(true)}
        src={src}
        alt={currency.name || currency.wrapped.address}
        className="rounded-full"
        {...rest}
      />
    </Link.External>
  )
}
