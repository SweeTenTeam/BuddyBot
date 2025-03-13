import { Metadata } from './metadata.js';

export class Information {
  constructor(
    public readonly content: string,
    public readonly metadata: Metadata,
  ) {}
}