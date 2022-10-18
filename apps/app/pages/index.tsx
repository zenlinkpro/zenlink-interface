import { Button, Link, Typography } from '@zenlink-interface/ui'
import Checkbox from '@zenlink-interface/ui/checkbox/Checkbox'

export default function Index() {
  return (
    <div>
      <Button>TEST</Button>
      <Checkbox checked></Checkbox>
      <Typography>HERO</Typography>
      <Link.Internal href="/swap" passHref={true}>
        <Button as="a" size="sm" className="ml-4 whitespace-nowrap w-32">
          Enter App
        </Button>
      </Link.Internal>
    </div>
  )
}
