export async function getRepo (userRepo) {
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

export async function getRepos (repositories, cache) {
  // Run async requests in parallel
  return Promise.all([...repositories].map(async (userRepo) => {
    const cashedValue = cache[userRepo]
    return cashedValue ? cashedValue : await getRepo(userRepo, cache)
  }))
}
