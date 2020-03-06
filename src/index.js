const drc = require('docker-registry-client')
const debug = require('debug')('docker-image-not-found')

const isImageNotFound = err =>
  err && err.body && err.body.code === 'NotFoundError'

/**
 * Checks if specific Docker image DOES NOT exist.
 * Resolves with true if the image DOES NOT exist, resolves with false for anything
 * else.
 */
const dockerImageNotFound = repo => {
  debug('parsing repo string %o', { repo })
  const rar = drc.parseRepoAndRef(repo)
  debug('parsed to %o', rar)

  const client = drc.createClientV2({
    repo: rar
  })

  const tagOrDigest = rar.tag || rar.digest

  return new Promise(resolve => {
    client.getManifest({ ref: tagOrDigest }, err => {
      client.close()

      if (err) {
        console.error(
          'got an error fetching info about Docker image %s:%s',
          rar.canonicalName,
          tagOrDigest
        )

        if (isImageNotFound(err)) {
          console.log('Got definite %s', err.body.code)
          return resolve(true)
        }

        console.error('got an error other than image not found')
        console.error('%o', err)

        return resolve(false)
      }

      console.log('found image %s:%s', rar.canonicalName, tagOrDigest)
      debug('full repo info %o', rar)
      return resolve(false)
    })
  })
}

/**
 * Resolves with an object containing image name and list of all tags
 * { name: 'cypress/browsers', tags: [...] }
 * @param {string} imageName like "cypress/browsers"
 */
const listTags = imageName => {
  debug('parsing repo name %o', { imageName })
  const repo = drc.parseRepoAndRef(imageName)
  debug('parsed to %o', repo)

  const client = drc.createClientV2({ repo })

  const tagOrDigest = repo.tag || repo.digest

  return new Promise((resolve, reject) => {
    client.listTags((err, repoTags) => {
      client.close()

      if (err) {
        console.error('could not list tags for %s %s', imageName, tagOrDigest)
        console.error('parsed into %o', repo)
        console.error(err)
        return reject(err)
      }

      debug('got repo tags %o', repoTags)
      resolve(repoTags)
    })
  })
}

module.exports = {
  dockerImageNotFound,
  listTags
}
