export class Answer {
  constructor(answerUsername: string, content: string) {
    this.answerUsername = answerUsername;
    this.content = content;
    this.likes = 0;
  }

  answerUsername: string;
  content: string;
  likes: number;
}
