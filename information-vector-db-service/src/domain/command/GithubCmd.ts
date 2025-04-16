import { RepoCmd } from "./RepoCmd.js";

export class GithubCmd {

  constructor(public readonly repoCmdList:RepoCmd[],public readonly lastUpdate?:Date){}
  // lastUpdate?: Date;
  // repoCmdList:RepoCmd[];

  
}
 

