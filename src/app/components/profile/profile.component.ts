import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {User} from '../../class/user';
import {FirestoreService} from '../../core/services/firestore.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackbarService} from '../../core/services/snackbar.service';
import {NotifierService} from 'angular-notifier';
import {MatDialog} from '@angular/material';
import {EditPointerComponent} from './edit-pointer/edit-pointer.component';
import {Pointer} from '../../interfaces/pointer';
import {ImagePost} from '../../class/imagePost';
import OrderByDirection = firebase.firestore.OrderByDirection;
import QuerySnapshot = firebase.firestore.QuerySnapshot;
import {mapStyle} from '../../enums/map-style.enum';
import * as firebase from 'firebase';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  public userData: User;
  public userImagePosts: ImagePost[] = [];
  public userName = null;
  public isUserProfile = true;
  private notifier: NotifierService;
  public postsOrder: OrderByDirection = 'desc';
  public mapStyle: any = mapStyle;
  public postsQuery;
  public lastDoc = null;
  public postLoader = false;
  public newPostNotification = false;

  // todo map theme based on users theme preferences

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public router: Router,
    private notificationService: SnackbarService,
    notifier: NotifierService,
    public dialog: MatDialog) {
    this.notifier = notifier;
  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100 &&
      !this.postLoader && this.userImagePosts.length) {
      this.loadPosts();
    }
  }

  ngOnInit() {
    if (this.route.snapshot.paramMap.get('userName')) { // visiting
      this.isUserProfile = false;
      this.route.paramMap.subscribe(param => {
        this.userName = param.get('userName');
        this.getUserByUsername();
      });
    } else { // profile
      this.userDataSubscription();
    }
  }

  ngOnDestroy(): void {
    this.snackBar.dismiss();
  }

  userDataSubscription() {
    this.authService.user$
      .subscribe((doc) => {
        this.processNewUserData(doc);
      });
  }

  public getUserByUsername() {
    this.firestoreService.getUserByUserName(this.userName)
      .onSnapshot((doc) => {
        if (doc.docs[0]) {
          this.processNewUserData(doc.docs[0].data());
        }
      });

  }

  public processNewUserData(newData: User) {
    if (this.userData && newData.posts !== this.userData.posts || !this.userData) {
      this.userData = newData;
      this.userImagePosts = [];
      this.setQuery();
    } else {
      this.userData = newData;
    }
  }

  // POSTS
  public getUserPostsById() {
    if (this.userData) {
      this.postLoader = true;
      this.postsQuery.onSnapshot((res: QuerySnapshot<ImagePost>) => {
        if (res) {
          if (res.docs.length === 0) {
            this.lastDoc = null;
          }
          this.postLoader = false;
          // the post is newer than the rest and it should be on top. Let user know about it.
          if (res.docs.length && this.userImagePosts.length &&
            res.docs[0].data().date > this.userImagePosts[0].date && this.postsOrder === 'desc') {
            this.newPostNotification = true;
            return;
          }
          res.docs.forEach(post => {
            const postPosition = this.findPost(post.data());
            if (postPosition === -1) { // the post does not exist
              this.lastDoc = res.docs[res.docs.length - 1];
              this.userImagePosts.push(post.data());
            } else {
              this.userImagePosts[postPosition].likes = post.data().likes;
              post.data().comments.length < this.userImagePosts[postPosition].comments.length
                ? this.userImagePosts[postPosition].comments = post.data().comments
                : null;
            }
          });
        } // else not found
      });
    }
  }

  public findPost(postToFind: ImagePost): number {
    let position = -1;
    this.userImagePosts.forEach((post: ImagePost, index) => {
      if (post.postId === postToFind.postId) {
        position = index;
        return;
      }
    });
    return position;
  }

  public deletePost(postToDelete: ImagePost) {
    this.firestoreService.deleteImagePost(postToDelete).then(() => {
      this.snackBar.open('Posted removed', 'dismiss', {
        duration: 5000
      });
      this.userImagePosts.forEach((post, index) => {
        if (post.postId === postToDelete.postId) {
          this.userImagePosts.splice(index, 1);
          return;
        }
      });
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Failed trying to remove post', '', {
        duration: 5000
      });
    });
  }

  public loadPosts() {
    if (!this.lastDoc) { // no more posts
      return;
    }
    this.postsQuery = this.firestoreService.getPostsByUserId(this.userData.personalInfo.userId)
      .orderBy('date', this.postsOrder).startAfter(this.lastDoc)
      .limit(1);
    this.getUserPostsById();
  }

  public setQuery() {
    this.postsQuery = this.firestoreService.getPostsByUserId(this.userData.personalInfo.userId)
      .orderBy('date', this.postsOrder).limit(1);
    this.getUserPostsById();
  }

  public orderBy(value: OrderByDirection) {
    this.postsOrder = value;
    this.refreshPosts();
  }

  public refreshPosts() {
    this.newPostNotification = false;
    this.postLoader = true;
    this.lastDoc = null;
    this.userImagePosts = [];
    setTimeout(() => {
      this.setQuery();
    }, 1000);
  }

  // MAP
  createPointer(newCoords) {
    const newPointer: Pointer = {
      lat: newCoords.coords.lat,
      lng: newCoords.coords.lng,
      title: 'Title',
      description: 'Add description'
    };
    this.firestoreService.addMapPointer(newPointer, this.userData.personalInfo.userId);
  }

  editPointer(pointer: Pointer) {
    const dialogRef = this.dialog.open(EditPointerComponent, {
      width: '250px',
      data: {title: pointer.title, description: pointer.description}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.snackBar.open('Edit pointer canceled', '', {
          duration: 5000,
        });
        return;
      }
      if (pointer.title === result.title && pointer.description === result.description) {
        this.snackBar.open('No changes were applied', '', {
          duration: 5000
        });
        return;
      }
      // objects inside arrays cant be modified in firestore. so I delete it and create it again
      this.removePointer(pointer);
      pointer.title = result.title;
      pointer.description = result.description;
      this.firestoreService.addMapPointer(pointer, this.userData.personalInfo.userId);
      this.snackBar.open('Pointer updated succesfully', '', {
        duration: 5000
      });
    });
  }

  removePointer(pointer: Pointer) {
    this.firestoreService.deleteMapPointer(pointer, this.userData.personalInfo.userId);
  }

  // @todo undo action ?
  // @todo if firestore observable doesnt return, user doesnt exist, -> authenticate page
  // @todo reactive last post info if its diferent show notification of new posts
}
