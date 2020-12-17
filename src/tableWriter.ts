import * as fs from 'fs'
import * as core from '@actions/core'
import {CandidateSearchResults} from './types'

export async function writeTable(
  outputPath: string,
  results: CandidateSearchResults[],
  whatIf?: boolean
): Promise<void> {
  // Write a new file each time
  if (!whatIf && fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath)
  }

  let fileContents =
    '| Extension | Total Hits | Unique Repositories | PR |\n' +
    '| --- | --- | --- | --- |\n'

  for (const result of results) {
    for (const extensionResult of result.extensionResults) {
      const cells = [
        `[${extensionResult.extension.extension}](https://github.com/search?q=${extensionResult.extension.query})`,
        extensionResult.hits,
        extensionResult.uniqueRepos,
        result.candidate.pr
          ? `[${result.candidate.pr}](https://github.com/github/linguist/pull/${result.candidate.pr})`
          : ''
      ]
      fileContents += `${cells.join(' | ')}\n`
    }
  }

  fileContents += '\n\n_Generated by a tool_\n'

  core.debug(fileContents)

  if (!whatIf) {
    fs.writeFileSync(outputPath, fileContents)
  }
}