import { nextSiblings, getStartCount, getDescMeta } from './utils'
import { load, parse } from 'gh-emoji'
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

export function setEmojiSize (emojis) {
  if (!emojis.length) return;
  for (let emoji of emojis) {
    emoji.style.maxWidth = '100%';
    emoji.style.height = '21px';
  }
}

export function updateNode (node, data) {
  if (!data) return
  const { language, description } = data
  const descElStyles = 'repo-list-description'
  const metaElStyles = 'repo-list-meta'
  const containerEl = document.createDocumentFragment()
  const descEl = document.createElement('p')
  const metaEl = document.createElement('p')
  const metaElData = [
    language || '&ndash;',
    getStartCount(data.stargazers_count)
  ]

  load()
    .then(() => {
      descEl.innerHTML = parse(description)
        || '<i>No description or website provided.<i>'
      return descEl.getElementsByTagName('img');
    })
    .then(setEmojiSize)
    .then(() => {
      descEl.classList.add(descElStyles)
      metaEl.innerHTML = `${getDescMeta(metaElData)}`
      metaEl.classList.add(metaElStyles)
      containerEl.appendChild(descEl).appendChild(metaEl)
      node.appendChild(containerEl)
    });
}
