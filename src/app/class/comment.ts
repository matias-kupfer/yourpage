import {Answer} from './answer';
import * as firebase from 'firebase';


export class Comment {
  constructor(commentUsername: string, content: string) {
    this.commentUsername = commentUsername;
    this.content = content;
    this.liked = false;
    this.date = new Date();
    this.answers = [];
  }

  commentUsername: string;
  content: string;
  liked: boolean;
  date: any;
  answers: Answer[];
}

// TODO fix date as timeStamp
