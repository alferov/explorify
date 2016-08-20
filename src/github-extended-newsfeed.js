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

// Grab repo details from API and update the cache if needed
const getRepoDetails = (userRepo, cache) => {
  const API = 'https://api.github.com/repos/'

  return new Promise((resolve, reject) => {
    if (cache[userRepo]) {
      resolve(cache[userRepo])
      return
    }

    fetch(API + userRepo)
      .then(result => result.json())
      .then(json => cache[userRepo] = json)
      .then(resolve)
      .catch(reject)
  })
}

const extend = () => {
  const nodes = Array.from(getFeedItems())
  const repositories = new Set(nodes.map(mapNodes))

  Promise
    .all([...repositories].map(userRepo => getRepoDetails(userRepo, cache)))
    .then((result) => {})
    .catch(console.error)
}

extend()
