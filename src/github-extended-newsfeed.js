/* global fetch */
import Deque from 'double-ended-queue'
import { getRepo, getRepos } from './api'
import { getUserRepo, getFeedItems, updateNode } from './dom'

const dashboard = document.getElementById('dashboard')
let cache = {}
let lastUpdated = null

// Transform an array of data to an object: { userRepo: dataFromAPI }
function normalizeResponse (response) {
  return response.reduce((prev, curr)=> {
    if (!curr) return prev
    const { full_name } = curr
    prev[full_name] = curr
    return prev
  }, {})
}

async function inject () {
  // Cache DOM nodes
  const nodes = getFeedItems(lastUpdated)
  if (!nodes.length) return
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
    setTimeout(inject, 500)
  })

inject()
