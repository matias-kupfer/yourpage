export interface User {
  personalInfo: {
    userId: string;
    email: string;
    name: string;
    lastName: string;
    gender: string;
    birthday: Date;
  };
  accountInfo: {
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
  statisticsInfo: {
    followers: number;
    following: number;
    posts: number;
  };
}
