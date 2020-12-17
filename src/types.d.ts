export interface Candidate {
  pr: number
  extensions: ExtensionInfo[]
}

export interface ExtensionInfo {
  extension: string
  extendedSearch?: string
  query: string
}

export interface CandidateSearchResults {
  candidate: Candidate
  extensionResults: ExtensionSearchResults[]
}
export interface ExtensionSearchResults {
  extension: ExtensionInfo
  hits: number
  uniqueRepos: number
  timestamp: Date
}
