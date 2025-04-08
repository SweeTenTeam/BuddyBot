export enum OriginEntity {
  GITHUB = 'GITHUB',
  JIRA = 'JIRA',
  CONFLUENCE = "CONFLUENCE"
}

export enum TypeEntity {
  COMMIT = 'COMMIT',
  DOCUMENT = 'DOCUMENT',
  FILE = 'FILE',
  PULLREQUEST = 'PULLREQUEST',
  REPOSITORY = 'REPOSITORY',
  TICKET = 'TICKET',
  WORKFLOW = 'WORKFLOW',
  WORKFLOW_RUN = 'WORKFLOW_RUN',
}

export class MetadataEntity {
  constructor(
    public readonly origin: OriginEntity,
    public readonly type: TypeEntity,
    public readonly originID: string, 
  ) {}
}