import { Injectable } from '@nestjs/common';
import { GithubUseCase } from './port/in/GithubUseCase';
import { JiraAPIPort } from './port/out/JiraAPIPort';

@Injectable()
export class GithubService implements GithubUseCase {


  constructor(private readonly jiraAdapter: JiraAPIPort) {}
  
  getHello(): string {
    return 'Hello World!';
  }
}
