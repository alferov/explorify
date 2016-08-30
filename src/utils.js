export function nextSiblings (el, predicate) {
  if (!el) throw new TypeError('Element must be defined')
  const result = []
  while ((el = el.nextElementSibling) !== null) {
    if (!predicate(el)) continue
    result.push(el)
  }
  return result
}
