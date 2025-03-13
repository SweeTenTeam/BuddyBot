import { Injectable } from '@nestjs/common';
import { GithubUseCase } from './port/in/GithubUseCase.js';
import { JiraAPIPort } from './port/out/JiraAPIPort.js';

@Injectable()
export class GithubService implements GithubUseCase {


  constructor(private readonly jiraAdapter: JiraAPIPort) {}
  
  getHello(): string {
    return 'Hello World!';
  }
}
