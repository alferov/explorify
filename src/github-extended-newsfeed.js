/* global fetch */
import Deque from 'double-ended-queue'
let dashboard = document.getElementById('dashboard')
let cache = {}
let lastUpdated = null

const nextSiblings = (el, predicate) => {
  var result = []
  if (!el) return
  while (el = el.nextElementSibling) {
    if (!predicate(el)) continue
    result.push(el)
  }
  return result
}

// Get all newsfeed DOM elements
const getFeedItems = (startingFrom) => {
  const allowed = ['watch_started', 'create', 'fork']

  const predicate = (el) => allowed.some((i) => el.classList.contains(i))
  // If startingFrom is defined, function will look for the immediately
  // following sibling of this element
  const firstMatchedEl = startingFrom
    ? startingFrom
    : document.querySelector(...allowed.map((i) => `.${i}`))

  return [firstMatchedEl, ...nextSiblings(firstMatchedEl, predicate)]
}

// Get user/repo pairs from the DOM nodes
const getUserRepo = (el) => {
  return el.querySelector('.title').lastElementChild.innerText
}

const getRepo = async (userRepo) => {
  const API = 'https://api.github.com/repos/'
  try {
    const response = await fetch(API + userRepo)
    if (403 === response.status) throw new Error('Unauthorized')
    if (404 === response.status) throw new Error(`${userRepo} is not found`)
    return await response.json()
  } catch (err) {
    console.error(err)
  }
}

const getRepos = async (repositories, cache) => {
  // Run async requests in parallel
  return Promise.all([...repositories].map(async (userRepo) => {
    const cashedValue = cache[userRepo]
    return cashedValue ? cashedValue : await getRepo(userRepo, cache)
  }))
}

// Transform an array of data to an object: { userRepo: dataFromAPI }
const normalizeResponse = (response) => {
  return response.reduce((prev, curr)=> {
    if (!curr) return prev
    const { full_name } = curr
    prev[full_name] = curr
    return prev
  }, {})
}

const updateNode = (node, data) => {
  if (!data) return
  const description = document.createElement('p')
  description.innerText = data.description
  node.appendChild(description)
}

const extend = async () => {
  // Cache DOM nodes
  const nodes = getFeedItems(lastUpdated)
  // Initialize a Set of unique user/repo pairs
  const repositories = new Set(nodes.map(getUserRepo))
  const data = await getRepos(repositories, cache)
  cache = {...cache, ...normalizeResponse(data)}
  // Initialize a queue of DOM nodes that are going to be updated
  const nodeQueue = new Deque(nodes)

  while (!nodeQueue.isEmpty()) {
    const node = lastUpdated = nodeQueue.shift()
    const userRepo = getUserRepo(node)
    updateNode(node, cache[userRepo])
  }
}

dashboard
  .addEventListener('submit', () => {
    setTimeout(extend, 500)
  })

extend()
