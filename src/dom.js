import { nextSiblings, getStartCount, getDescMeta } from './utils'

// Get user/repo pairs from the DOM nodes
export function getUserRepo (el) {
  if (!el) return
  return el.querySelector('.title').lastElementChild.innerText
}

// Get all newsfeed DOM elements
export function getFeedItems (startingFrom) {
  const allowed = ['watch_started', 'create', 'fork']

  const predicate = (el) => allowed.some((i) => el.classList.contains(i))
  // If startingFrom is defined, the function will look for the immediately
  // following sibling of this element. Otherwise, it will take the very first
  // matching element on the page
  const firstMatchedEl = startingFrom
    ? startingFrom
    : document.querySelector(...allowed.map((i) => `.${i}`))

  return startingFrom
    ? [...nextSiblings(firstMatchedEl, predicate)]
    : [firstMatchedEl, ...nextSiblings(firstMatchedEl, predicate)]
}

export function updateNode (node, data) {
  if (!data) return
  const { language, description } = data
  const descriptionStyles = 'repo-list-description'
  const metaStyles = 'repo-list-meta'
  const containerEl = document.createDocumentFragment()
  const descEl = document.createElement('p')
  const metaEl = document.createElement('p')
  const metaData = [
    language || '&ndash;',
    getStartCount(data.stargazers_count)
  ]
  descEl.innerHTML = description || '<i>No description or website provided.<i>'
  descEl.classList.add(descriptionStyles)

  metaEl.innerHTML = `${getDescMeta(metaData)}`
  metaEl.classList.add(metaStyles)
  containerEl.appendChild(descEl).appendChild(metaEl)
  node.appendChild(containerEl)
}
