import { Controller, Get, Inject } from '@nestjs/common';
import { GithubService } from 'src/application/github.service';
import { ConfluenceUseCase } from 'src/application/port/in/ConfluenceUseCase';
import { GITHUB_USECASE, GithubUseCase } from 'src/application/port/in/GithubUseCase';
import { JiraUseCase } from 'src/application/port/in/JiraUseCase';
import { JiraCmd } from 'src/domain/JiraCmd';

@Controller()
export class TestController {
  
  constructor(@Inject(GITHUB_USECASE) private readonly appService: GithubUseCase) {}

  @Get()
  getHello(): string {
    console.log("[+] GET hihiha")
    return this.appService.getHello();
  }
}
