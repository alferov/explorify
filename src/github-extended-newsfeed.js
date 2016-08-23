/* global fetch */
let dashboard = document.getElementById('dashboard')
let cache = {}

// Get all newsfeed DOM nodes
const getFeedItems = (startingFrom) => {
  const allowed = ['.watch_started', '.create', '.fork']
  return document.querySelectorAll(...allowed)
}

// Get user/repo pairs from the DOM nodes
const mapNodes = (node) => {
  return node.querySelector('.title').lastElementChild.innerText
}

const getRepo = async (userRepo) => {
  const API = 'https://api.github.com/repos'
  try {
    const response = await fetch(API + userRepo)
    if (403 === response.status) throw new Error('Unauthorized')
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
const normalizeResponses = (responses) => {
  return responses.reduce((prev, curr)=> {
    if (!curr) return prev
    const { full_name } = curr
    prev[full_name] = curr
    return curr
  }, {})
}

const extend = async () => {
  const nodes = Array.from(getFeedItems())
  const repositories = new Set(nodes.map(mapNodes))
  const result = await getRepos(repositories, cache)
}

extend()
