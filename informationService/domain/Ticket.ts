export class Ticket {
  public title: string;
  public description: string;
  public assignee: string;
  public status: string;
  //public mainActivity: string;
  public relatedSprint: string;
  public storyPoint: string;
  public creator: string;
  public priority: string;
  public expiryDate: Date;
  public comments: string[];
  public relatedTickets: string[];

  constructor(
    title: string,
    description: string,
    assignee: string,
    status: string,
    //mainActivity: string,
    relatedSprint: string,
    storyPoint: string,
    creator: string,
    priority: string,
    expiryDate: Date,
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

  toJson(): JSON{
    let result: JSON = JSON;
    result['title'] = this.title;
    result['description'] = this.description;
    result['assignee'] = this.assignee;
    result['status'] = this.status;
    return result;
  }
}
