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
  .option('outputFile', {
    alias: 'output',
    demand: true,
    description: 'Path to the markdown file to write results to',
    default: 'extensions.md'
  })
  .string('outputFile')
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
    execute(argv.candidatesFile, argv.outputFile, argv.githubToken, argv.whatIf)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    process.exit(1)
  }
})()
