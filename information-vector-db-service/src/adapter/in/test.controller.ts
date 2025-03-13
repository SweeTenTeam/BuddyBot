import { Controller, Get, Inject } from '@nestjs/common';

import { GITHUB_USECASE, GithubUseCase } from '../../application/port/in/GithubUseCase.js';


@Controller()
export class TestController {
  
  constructor(@Inject(GITHUB_USECASE) private readonly appService: GithubUseCase) {}

  @Get()
  getHello(): string {
    console.log("[+] GET hihiha")
    return this.appService.getHello();
  }
}
