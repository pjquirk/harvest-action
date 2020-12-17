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
  extension: string
  hits: number
  uniqueRepos: number
  timestamp: Date
}
