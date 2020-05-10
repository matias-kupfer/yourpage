import Timestamp = firebase.firestore.Timestamp;
import * as firebase from 'firebase';

export interface LatestPostsInfo {
  uid: string;
  postId: string;
  date: Timestamp;
}
