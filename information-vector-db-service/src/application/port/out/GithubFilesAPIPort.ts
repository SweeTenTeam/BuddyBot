import { File } from "src/domain/business/File.js"
import { FileCmd } from "src/domain/command/FileCmd.js"

export const GITHUB_FILES_API_PORT = Symbol('GITHUB_FILES_API_PORT');

export interface GithubFilesAPIPort {
    fetchGithubFilesInfo(req: FileCmd[]): Promise<File[]>
}