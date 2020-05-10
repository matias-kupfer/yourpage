import {Component, HostListener, OnInit} from '@angular/core';
import {FirestoreService} from '../../core/services/firestore.service';
import {LatestPostsInfo} from '../../interfaces/latestPostsInfo';
import * as firebase from 'firebase';
import QuerySnapshot = firebase.firestore.QuerySnapshot;
import {DocumentSnapshot} from '@angular/fire/firestore';
import {ImagePost} from '../../class/imagePost';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public latestPosts: ImagePost[] = [];
  public query;
  public lastDoc = null;
  public postLoader = false;

  constructor(
    private firestoreService: FirestoreService) {
  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100 && !this.postLoader && this.latestPosts.length) {
      this.setQuery();
    }
  }


  ngOnInit() {
    window.scrollTo(0, 0);
    this.query = this.firestoreService.getLatestPostsInfo().limit(1);
    this.getLatestPostsInfo();
  }

  public setQuery() {
    if (!this.lastDoc) { // no more posts
      return;
    }
    this.query = this.firestoreService.getLatestPostsInfo().startAfter(this.lastDoc).limit(1);
    this.getLatestPostsInfo();
  }

  public getLatestPostsInfo() {
    this.postLoader = true;
    this.query.get().then((res: QuerySnapshot<LatestPostsInfo>) => {
      if (res) {
        this.postLoader = false;
        this.lastDoc = res.docs[res.docs.length - 1];
        res.docs.forEach(postInfo => this.getLatestPosts(postInfo.data()));
      }
    });
  }

  public getLatestPosts(postInfo: LatestPostsInfo) {
    this.firestoreService.getPost(postInfo).onSnapshot((post: DocumentSnapshot<ImagePost>) => {
      if (post.data()) {
        const postPosition = this.findPost(post.data());
        if (postPosition === -1) {
          this.latestPosts.push(post.data());
        } else {
          this.latestPosts[postPosition].likes = post.data().likes;
          post.data().comments.length < this.latestPosts[postPosition].comments.length
            ? this.latestPosts[postPosition].comments = post.data().comments
            : null;
        }
      }
    });
  }

  public findPost(postToFind: ImagePost): number {
    let position = -1;
    this.latestPosts.forEach((post: ImagePost, index) => {
      if (post.postId === postToFind.postId) {
        position = index;
        return;
      }
    });
    return position;
  }

  /*public getLatestPosts(postInfo: LatestPostsInfo) {
    this.firestoreService.getPost(postInfo).get().then((post: DocumentSnapshot<ImagePost>) => {
      this.latestPosts.push(post.data());
    }).catch(e => console.log(e));
  }*/
}
