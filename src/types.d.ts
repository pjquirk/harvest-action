export interface Candidate {
  pr: number
  extensions: ExtensionInfo[]
}

export interface ExtensionInfo {
  extension: string
  extendedSearch?: string
}

export interface CandidateSearchResults {
  extensionResults: ExtensionSearchResults[]
}
export interface ExtensionSearchResults {
  hits: number
  uniqueRepos: number
  timestamp: Date
}
