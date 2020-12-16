import * as fs from "fs"
import { Candidate } from "./types"

export function readCandidates(path: string): Candidate[] | undefined {
    if (!path) {
        return undefined
    }
    const rawData = fs.readFileSync(path)
    const rawString = rawData.toString()
    return JSON.parse(rawString)
}
