import { nextSiblings } from './utils'

// Get user/repo pairs from the DOM nodes
export function getUserRepo (el) {
  if (!el) return
  return el.querySelector('.title').lastElementChild.innerText
}

// Get all newsfeed DOM elements
export function getFeedItems (startingFrom) {
  const allowed = ['watch_started', 'create', 'fork']

  const predicate = (el) => allowed.some((i) => el.classList.contains(i))
  // If startingFrom is defined, function will look for the immediately
  // following sibling of this element
  const firstMatchedEl = startingFrom
    ? startingFrom
    : document.querySelector(...allowed.map((i) => `.${i}`))

  return [firstMatchedEl, ...nextSiblings(firstMatchedEl, predicate)]
}

export function updateNode (node, data) {
  if (!data) return
  const description = document.createElement('p')
  description.innerText = data.description
  node.appendChild(description)
}