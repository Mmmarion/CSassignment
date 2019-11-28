export class EmailData {
  Id: number;

  constructor(
    public Subject: string,
    public EmailContent: string,
    public Recipiens: string[]
  ) {}
}
