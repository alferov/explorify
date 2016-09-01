export function nextSiblings (el, predicate) {
  if (!el) throw new TypeError('Element must be defined')
  const result = []
  while ((el = el.nextElementSibling) !== null) {
    if (!predicate(el)) continue
    result.push(el)
  }
  return result
}

export function getStartCount (numberOfStars) {
  return `${numberOfStars} ${numberOfStars === 1 ? 'star' : 'stars'}`
}
