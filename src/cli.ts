// `require` is needed to get certain features of `yargs` to work correctly
//const yargs = require("yargs")
import * as yargs from 'yargs'
import {execute} from './core'

const argv = yargs
  .option('candidatesFile', {
    alias: 'candidates',
    demand: true,
    description: 'JSON file containing candidates for languages to support'
  })
  .string('candidatesFile')
  .option('githubToken', {
    alias: 'token',
    demand: true,
    description: 'The token to search with; usually GITHUB_TOKEN is sufficient'
  })
  .string('githubToken')
  .option('whatIf', {
    demand: false,
    default: false,
    description: 'Avoids writing any output to disk or creating actual issues'
  })
  .boolean('whatIf')
  .version().argv

;(async () => {
  try {
    execute(argv.candidatesFile, argv.githubToken, argv.whatIf)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
