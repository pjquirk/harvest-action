import * as core from '@actions/core'
import { execute } from "./core"

async function run(): Promise<void> {
  try {
    const token = core.getInput('githubToken')
    const candidatesFile = core.getInput('candidatesFile')

    execute(candidatesFile, token)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
