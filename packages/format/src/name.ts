// shorten the name to have 8 characters at start
export function shortenName(name?: string, characters = 10) {
  if (!name)
    return ''
  return name.length <= characters ? name : `${name.substring(0, characters)}...`
}
