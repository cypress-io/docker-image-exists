const drc = require('docker-registry-client')

const isImageNotFound = err =>
  err && err.body && err.body.code === 'NotFoundError'

/**
 * Checks if specific Docker image DOES NOT exist.
 * Resolves with true if the image DOES NOT exist, resolves with false for anything
 * else.
 */
const dockerImageNotFound = repo => {
  const rar = drc.parseRepoAndRef(repo)

  const client = drc.createClientV2({
    repo: rar,
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
      return resolve(false)
    })
  })
}

module.exports = {
  dockerImageNotFound,
}
