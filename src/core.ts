import * as core from '@actions/core'
import {Octokit} from '@octokit/rest'
import {readCandidates} from './candidatesReader'
import {
  CandidateSearchResults,
  ExtensionInfo,
  ExtensionSearchResults
} from './types'

export async function execute(
  candidatesFile: string,
  token: string,
  whatIf?: boolean
): Promise<void> {
  const octokit = new Octokit({auth: token})

  if (whatIf) {
    core.info('whatIf enabled')
  }

  core.info(`Loading candidates from ${candidatesFile} ...`)
  const candidates = readCandidates(candidatesFile)
  if (!candidates || candidates.length === 0) {
    core.info('No candidates were found, nothing to do.')
    return
  }
  core.info(`Found ${candidates.length} candidates`)

  const results: CandidateSearchResults = {
    extensionResults: []
  }

  for (const candidate of candidates) {
    core.info(`Getting hit information for PR #${candidate.pr}...`)
    for (const extension of candidate.extensions) {
      let searchResults = await search(octokit, extension)
      const totalHits = countValues(searchResults)
      if (totalHits >= 100) {
        core.info(
          `Found ${totalHits} >= 1000 hits (across ${
            Object.keys(searchResults).length
          } unique repositories), searching again by index time`
        )
        searchResults = await search(
          octokit,
          extension,
          'indexed',
          'desc',
          searchResults
        )
        searchResults = await search(
          octokit,
          extension,
          'indexed',
          'asc',
          searchResults
        )
      }

      const extensionResult: ExtensionSearchResults = {
        timestamp: new Date(),
        hits: countValues(searchResults),
        uniqueRepos: Object.keys(searchResults).length
      }

      core.info(
        `Found ${extensionResult.hits} total hits across ${extensionResult.uniqueRepos} unique repositories`
      )
      results.extensionResults.push(extensionResult)
    }
  }
}

// Returns a list of URLs to unique matches
async function search(
  octokit: Octokit,
  extension: ExtensionInfo,
  sort?: 'indexed' | undefined,
  order?: 'desc' | 'asc',
  previousResults?: Record<string, Set<string>>
): Promise<Record<string, Set<string>>> {
  const extendedSearch = extension.extendedSearch || 'NOT+nothack'
  const query = `extension:${extension.extension}+${extendedSearch}`

  type SearchResult = {
    htmlUrl: string
    repoName: string
  }

  core.info(`Searching for '${query}'...`)
  let results: SearchResult[] = []

  for await (const response of octokit.paginate.iterator('GET /search/code', {
    q: query,
    per_page: 100,
    sort,
    order
  })) {
    core.debug(
      `Got ${response.status} response with ${response.data.length} items`
    )
    results = results.concat(
      response.data.map(code => {
        return {htmlUrl: code.html_url, repoName: code.repository.full_name}
      })
    )
    await wait(3000)
  }

  if (!results) {
    core.error('Search failed to return anything')
    return {}
  }

  return results.reduce((hash, repo) => {
    hash[repo.repoName] = hash[repo.repoName] || new Set<string>()
    hash[repo.repoName].add(repo.htmlUrl)
    return hash
  }, previousResults || ({} as Record<string, Set<string>>))
}

function countValues(record: Record<string, Set<string>>): number {
  return Object.values(record).reduce((count, urls) => count + urls.size, 0)
}

async function wait(ms: number): Promise<void> {
  core.debug(`Sleeping ${ms} ms`)
  return new Promise(resolve => setTimeout(() => resolve(), ms))
}
