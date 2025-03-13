import { Metadata } from './metadata';

export class Information {
  constructor(
    public readonly content: string,
    public readonly metadata: Metadata,
  ) {}
}