export interface User {
  personalInfo: {
    userId: string;
    displayName: string;
    email: string;
    setUp: boolean;
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
  };
  statisticsInfo: {
    followers: number;
    following: number;
    posts: number;
  };
}
