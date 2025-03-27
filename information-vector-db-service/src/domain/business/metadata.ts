export enum Origin {
  GITHUB = 'SYSTEM',
  JIRA = 'USER',
  CONFLUENCE = "CONFLUENCE"
}

export enum Type {
  COMMMIT = 'COMMIT',
}

export class Metadata {
  constructor(
    public readonly origin: Origin,
    public readonly type: Type,
    public readonly originID: string, 
  ) {}
}