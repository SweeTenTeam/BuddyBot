import { File } from "src/domain/File.js"

export interface GithubFilesAPIPort{
    fetchGithubFilesInfo(): Promise<File[]>
}