import {Comment} from './comment';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export class ImagePost {
  constructor(userId: string, title: string, caption: string, country: string, city: string) {
    this.userId = userId;
    this.postId = null;
    this.date = null;
    this.country = country;
    this.city = city;
    this.imagesUrls = [];
    this.title = title;
    this.caption = caption;
    this.likes = [];
    this.comments = [];
  }

  public userId: string;
  public postId: string;
  public date: Timestamp;
  public country: string;
  public city: string;
  public imagesUrls: string[];
  public title: string;
  public caption: string;
  public likes: string[];
  public comments: Comment[];
}
