export function nextSiblings (el, predicate) {
  if (!el) throw new TypeError('Element must be defined')
  const result = []
  while ((el = el.nextElementSibling) !== null) {
    if (!predicate(el)) continue
    result.push(el)
  }
  return result
}

export function getStartCount (numberOfStars = 0) {
  return `${numberOfStars} ${numberOfStars === 1 ? 'star' : 'stars'}`
}

export function getDescMeta (meta = []) {
  return meta.filter(Boolean).join(' • ')
}
