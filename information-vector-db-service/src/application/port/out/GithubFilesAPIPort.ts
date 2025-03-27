import { File } from "src/domain/business/File.js"
import { FileCmd } from "src/domain/command/FileCmd.js"

export interface GithubFilesAPIPort{
    fetchGithubFilesInfo(req: FileCmd[]): Promise<File[]>
}