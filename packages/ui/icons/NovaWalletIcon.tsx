import Image from 'next/legacy/image'

export function NovaWalletIcon({ width, height }: React.ComponentProps<'image'>) {
  return (
    <div style={{ width, height }}>
      <Image
        alt="Nova Wallet"
        className="rounded-full"
        height={Number(height)}
        src="https://res.cloudinary.com/dtdshj0e5/image/upload/v1685591329/nova_wallet_tis05s.png"
        width={Number(width)}
      />
    </div>
  )
}
