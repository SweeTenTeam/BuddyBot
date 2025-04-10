import { Metadata} from "./metadata.js";
import { Origin, Type } from "../shared/enums.js";
import { JiraComment } from './JiraComment.js';


export class Ticket {
  public id: string;
  public title: string;
  public description: string;
  public assignee: string;
  public status: string;
  public relatedSprint: string;
  public storyPoint: string;
  public creator: string;
  public priority: string;
  public expiryDate: string;
  public comments: JiraComment[];
  public relatedTickets: string[];

  constructor(
    id: string,
    title: string,
    description: string,
    assignee: string,
    status: string,
    relatedSprint: string,
    storyPoint: string,
    creator: string,
    priority: string,
    expiryDate: string,
    comments: JiraComment[],
    relatedTickets: string[],
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.assignee = assignee;
    this.status = status;
    this.relatedSprint = relatedSprint;
    this.storyPoint = storyPoint;
    this.creator = creator;
    this.priority = priority;
    this.expiryDate = expiryDate;
    this.comments = comments;
    this.relatedTickets = relatedTickets;
  }

  toJson(): JSON {
    const result: JSON = JSON;
    result['title'] = this.title;
    result['description'] = this.description;
    result['assignee'] = this.assignee;
    result['status'] = this.status;
    result['comments'] = this.comments.map(comment => comment.toJson());

    return result;
  }

  toStringifiedJson(): string {
        return JSON.stringify(this);
    }

   getMetadata(): Metadata {
    return new Metadata(Origin.JIRA, Type.TICKET, this.id);
  }
}
