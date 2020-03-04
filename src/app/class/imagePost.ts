export class ImagePost {
  public userId: string;
  public postId: string;
  public date: Date;
  public imagesUrls: string[];
  public title: string;
  public caption: string;
  public likes: number;
  public comments: string[];

  constructor(userId: string, title: string, caption: string) {
    this.userId = userId;
    this.postId = null;
    this.date = null;
    this.imagesUrls = [];
    this.title = title;
    this.caption = caption;
    this.likes = 0;
    this.comments = [];
  }
}
