import {Answer} from './answer';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export class Comment {
  constructor(commentUsername: string, content: string) {
    this.commentUsername = commentUsername;
    this.content = content;
    this.liked = false;
    this.date = firebase.firestore.Timestamp.now();
    this.answers = [];
  }

  commentUsername: string;
  content: string;
  liked: boolean;
  public date: Timestamp;
  answers: Answer[];
}

// TODO fix date as timeStamp
