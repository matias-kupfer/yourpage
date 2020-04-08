export class User {
  constructor(uid: string, username: string, userLastName: string, userEmail: string, photoURL?: string) {
    this.personalInfo = {
      userId: uid,
      email: userEmail,
      name: username,
      lastName: userLastName,
      gender: null,
      birthday: null,
    };
    this.accountInfo = {
      userName: null,
      registrationDate: new Date(),
      imageUrl: photoURL,
      country: null,
      bio: null,
      socialLinks: {
        youtube: null,
        facebook: null,
        instagram: null,
        github: null,
        linkedin: null,
        twitter: null,
      },
      mapPointers: null,
    };
    this.followers = [];
    this.following = [];
    this.posts = 0;
  }

  public personalInfo: {
    userId: string;
    email: string;
    name: string;
    lastName: string;
    gender: string;
    birthday: Date;
  };
  public accountInfo: {
    userName: string;
    registrationDate: Date;
    imageUrl: string;
    country: string;
    bio: string;
    socialLinks: {
      youtube: string;
      facebook: string;
      instagram: string;
      github: string;
      linkedin: string;
      twitter: string;
    };
    mapPointers:
      [
        {
          lat: number;
          lng: number;
          title: string;
          description: string;
        }
      ]
  };
  followers: string[];
  following: string[];
  posts: number;
}
