export enum Origin {
  GITHUB = 'GITHUB',
  JIRA = 'JIRA',
  CONFLUENCE = "CONFLUENCE"
}

export enum Type {
  COMMIT = 'COMMIT',
  DOCUMENT = 'DOCUMENT',
  FILE = 'FILE',
  PULLREQUEST = 'PULLREQUEST',
  REPOSITORY = 'REPOSITORY',
  TICKET = 'TICKET',
  WORKFLOW = 'WORKFLOW'
}

export class Metadata {
  constructor(
    public readonly origin: Origin,
    public readonly type: Type,
    public readonly originID: string, 
  ) {}
}