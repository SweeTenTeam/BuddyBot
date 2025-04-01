export enum OriginEntity {
  GITHUB = 'GITHUB',
  JIRA = 'JIRA',
  CONFLUENCE = "CONFLUENCE"
}

export enum TypeEntity {
  COMMIT = 'COMMIT',
}

export class MetadataEntity {
  constructor(
    public readonly origin: OriginEntity,
    public readonly type: TypeEntity,
    public readonly originID: string, 
  ) {}
}