import {Comment} from './comment';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export class ImagePost {
  constructor(userId: string, title: string, caption: string, placeId: string) {
    this.userId = userId;
    this.postId = null;
    this.date = null;
    this.placeId = placeId;
    this.imagesUrls = [];
    this.title = title;
    this.caption = caption;
    this.likes = [];
    this.comments = [];
  }

  public userId: string;
  public postId: string;
  public date: Timestamp;
  public placeId;
  public imagesUrls: string[];
  public title: string;
  public caption: string;
  public likes: string[];
  public comments: Comment[];
}
