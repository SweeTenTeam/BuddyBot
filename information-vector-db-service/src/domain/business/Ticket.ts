import { Metadata, Origin, Type } from "./metadata.js";

export class Ticket {
  public id: string;
  public title: string;
  public description: string;
  public assignee: string;
  public status: string;
  //public mainActivity: string;
  public relatedSprint: string;
  public storyPoint: string;
  public creator: string;
  public priority: string;
  public expiryDate: string;
  public comments: string[];
  public relatedTickets: string[];

  constructor(
    id: string,
    title: string,
    description: string,
    assignee: string,
    status: string,
    //mainActivity: string,
    relatedSprint: string,
    storyPoint: string,
    creator: string,
    priority: string,
    expiryDate: string,
    comments: string[],
    relatedTickets: string[],
  ) {
    this.title = title;
    this.description = description;
    this.assignee = assignee;
    this.status = status;
    //this.mainActivity = mainActivity;
    this.relatedSprint = relatedSprint;
    this.storyPoint = storyPoint;
    this.creator = creator;
    this.priority = priority;
    this.expiryDate = expiryDate;
    this.comments = comments;
    this.relatedTickets = relatedTickets;
  }

  toStringifiedJson(): string {
    return JSON.stringify(this);
  }

  getMetadata(): Metadata {
    return new Metadata(Origin.JIRA, Type.TICKET, this.id);
  }
}
