export function ASSERT(f: () => boolean, t?: string) {
  if (process.env.NODE_ENV !== 'production') {
    if (!f() && t)
      console.error(t)
  }
}
