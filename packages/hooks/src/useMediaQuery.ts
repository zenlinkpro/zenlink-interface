import { useMediaQuery } from 'react-responsive'

export { useMediaQuery } from 'react-responsive'

export function useIsSmScreen() {
  return useMediaQuery({ query: '(max-width: 640px)' })
}
