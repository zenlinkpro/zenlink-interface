export const inputRegex = /^\d*(?:\\\.\d*)?$/ // match escaped "." characters via in a non-capturing group

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}
