import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

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
      registrationDate: firebase.firestore.Timestamp.now(),
      imageUrl: photoURL,
      placeId: null,
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
    registrationDate: Timestamp;
    imageUrl: string;
    placeId: string;
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
