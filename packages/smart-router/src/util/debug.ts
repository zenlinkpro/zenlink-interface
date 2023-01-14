export function ASSERT(f: () => boolean, t?: string) {
  if (process.env.NODE_ENV !== 'production') {
    if (!f() && t)
      console.error(t)
  }
}

let DEBUG_MODE = false
export function DEBUG(f: () => unknown) {
  if (DEBUG_MODE)
    f()
}
export function DEBUG_MODE_ON(on: boolean) {
  DEBUG_MODE = on
}
