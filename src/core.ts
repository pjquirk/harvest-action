import * as core from '@actions/core'
import { Octokit } from '@octokit/rest'
import {readCandidates} from './candidatesReader'

export function execute(candidatesFile: string, token: string, whatIf?: boolean) {
    const octokit = new Octokit({ auth: token });

    core.info(`Loading candidates from ${candidatesFile} ...`)
    const candidates = readCandidates(candidatesFile)
    if (!candidates || candidates.length == 0) {
      core.info("No candidates were found, nothing to do.")
      return
    }
    core.info(`Found ${candidates.length} candidates`)

    for (const candidate of candidates) {
      core.info(`Getting hit information for PR #${candidate.pr}...`)
      for (const extension of candidate.extensions) {
        const extendedSearch = extension.extendedSearch || "NOT nothack"
        const query = `extension:${extension.extension}+${extendedSearch}`
        core.info(`Searching for '${query}'...`)
        const searchResult = octokit.search.code({
          q: query,
        });
      }
    }
}