import { File } from "src/domain/business/File.js"
import { GithubCmd } from "src/domain/command/GithubCmd.js"

export interface GithubFilesAPIPort{
    fetchGithubFilesInfo(req: GithubCmd): Promise<File[]>
}