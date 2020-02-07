# docker-image-not-found [![CircleCI](https://circleci.com/gh/cypress-io/docker-image-not-found/tree/master.svg?style=svg)](https://circleci.com/gh/cypress-io/docker-image-not-found/tree/master)
> If you want to do something _only if the Docker Hub does not have an image_

Only exits with 0 if the Docker registry positively responds with "image not found" response. Any other response (found, network error, etc) will exit with 1.

## Use

### Image does not exist

```
npx docker-image-not-found --repo cypress/base:nope
got an error fetching info about Docker image docker.io/cypress/base:nope
Got definite NotFoundError
exiting with code 0
```

The only case when this script exits with `0`

### Image exists

```
npx docker-image-not-found --repo cypress/base:8.9.3
found image docker.io/cypress/base:8.9.3
exiting with code 1
```

### Network is down

```
$ ./bin/docker-image-not-found docker-image-not-found --repo cypress/base:nope
got an error fetching info about Docker image docker.io/cypress/base:nope
got an error other than image not found
Error: getaddrinfo ENOTFOUND registry-1.docker.io
    at GetAddrInfoReqWrap.onlookup [as oncomplete] (dns.js:60:26) {
  [stack]: 'Error: getaddrinfo ENOTFOUND registry-1.docker.io\n' +
    '    at GetAddrInfoReqWrap.onlookup [as oncomplete] (dns.js:60:26)',
  [message]: 'getaddrinfo ENOTFOUND registry-1.docker.io',
  errno: 'ENOTFOUND',
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'registry-1.docker.io'
}
exiting with code 1
```
