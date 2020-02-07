#!/usr/bin/env node

const program = require('commander')
const path = require('path')

const packageFilename = path.join(__dirname, '..', 'package.json')
const { version } = require(packageFilename)

program
  .version(version)
  .option('-r, --repo [repo]', 'Docker repo name (owner/name:tag)', '')
  .parse(process.argv)

if (typeof program.repo !== 'string' || program.repo.trim().length === 0) {
  throw new Error('You must specify --repo to work!')
}

const { dockerImageNotFound } = require('../src')

dockerImageNotFound(program.repo).then(notFound => {
  const exitCode = notFound ? 0 : 1
  console.log('exiting with code %d', exitCode)
  process.exit(exitCode)
})
