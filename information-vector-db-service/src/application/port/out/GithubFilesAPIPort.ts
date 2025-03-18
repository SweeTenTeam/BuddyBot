import { File } from "src/domain/File"

export interface GithubFilesAPIPort{
    fetchGithubFilesInfo(): Promise<File[]>
}