import * as core from '@actions/core'
import {execute} from './core'

async function run(): Promise<void> {
  try {
    const token = core.getInput('githubToken')
    const candidatesFile = core.getInput('candidatesFile')
    const outputFile = core.getInput('outputFile')

    execute(candidatesFile, outputFile, token)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
