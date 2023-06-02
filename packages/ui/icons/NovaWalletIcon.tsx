import Image from 'next/legacy/image'

export const NovaWalletIcon = ({ width, height }: React.ComponentProps<'image'>) => {
  return (
    <div style={{ width, height }}>
      <Image
        src="https://res.cloudinary.com/dtdshj0e5/image/upload/v1685591329/nova_wallet_tis05s.png"
        alt="Nova Wallet"
        className="rounded-full"
        width={Number(width)}
        height={Number(height)}
      />
    </div>
  )
}
