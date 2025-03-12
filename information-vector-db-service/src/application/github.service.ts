import { Injectable } from '@nestjs/common';
import { GithubUseCase } from './port/in/GithubUseCase';

@Injectable()
export class GithubService implements GithubUseCase {
  getHello(): string {
    return 'Hello World!';
  }
}
