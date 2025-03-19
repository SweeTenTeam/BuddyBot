import { File } from "src/domain/business/File.js"

export interface GithubFilesAPIPort{
    fetchGithubFilesInfo(): Promise<File[]>
}