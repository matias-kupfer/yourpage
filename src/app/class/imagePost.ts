import {Comment} from './comment';

export class ImagePost {
  public userId: string;
  public postId: string;
  public date: Date;
  public country: string;
  public city: string;
  public imagesUrls: string[];
  public title: string;
  public caption: string;
  public likes: string[];
  public comments: Comment[];
  // description will be an array in two languages
  // location array with city and country
  constructor(userId: string, title: string, caption: string, country: string, city: string) {
    this.userId = userId;
    this.postId = null;
    this.date = new Date();
    this.country = country;
    this.city = city;
    this.imagesUrls = [];
    this.title = title;
    this.caption = caption;
    this.likes = [];
    this.comments = [];
  }
}
