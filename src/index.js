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

module.exports = {
  dockerImageNotFound
}
