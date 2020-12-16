import * as core from '@actions/core'
import {readCandidates} from './candidatesReader'

async function run(): Promise<void> {
  try {
    const candidatesFile: string = core.getInput('candidatesFile')

    core.info(`Loading candidates from ${candidatesFile} ...`)
    const candidates = readCandidates(candidatesFile)

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
