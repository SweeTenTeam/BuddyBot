export enum OriginEntity {
  GITHUB = 'SYSTEM',
  JIRA = 'USER',
  CONFLUENCE = "CONFLUENCE"
}

export enum TypeEntity {
  COMMMIT = 'COMMIT',
}

export class MetadataEntity {
  constructor(
    public readonly origin: OriginEntity,
    public readonly type: TypeEntity,
    public readonly originID: string, 
  ) {}
}