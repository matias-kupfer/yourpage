import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
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
import {BehaviorSubject} from 'rxjs';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  public userData: User = null;
  public userImagePosts: ImagePost[] = null;
  public userName = this.route.snapshot.paramMap.get('userName');
  public isUserProfile = true;
  private notifier: NotifierService;
  public postsOrder$: BehaviorSubject<OrderByDirection> = new BehaviorSubject<OrderByDirection>('desc');
  public mapStyle: any = mapStyle;

  // todo map theme based on users theme preferences

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public router: Router,
    private notificationService: SnackbarService,
    notifier: NotifierService,
    private ngZone: NgZone,
    public dialog: MatDialog) {
    this.notifier = notifier;
  }


  ngOnInit() {
    if (this.userName) {
      this.isUserProfile = false;
      this.getUserByUsername();
    } else {
      this.userDataSubscription();
    }
    this.postsOrder$.subscribe(() => this.getUserPostsById());
  }

  ngOnDestroy(): void {
    this.snackBar.dismiss();
  }

  userDataSubscription() {
    this.authService.user$
      .subscribe((doc) => {
        this.userData = doc;
        this.getUserPostsById();
      });
  }

  public getUserByUsername() {
    this.userImagePosts = [];
    this.firestoreService.getUserByUserName(this.userName)
      .onSnapshot((doc) => {
        if (doc.docs[0]) {
          this.userData = doc.docs[0].data();
          this.getUserPostsById();
        }
      });

  }

  // POSTS
  public getUserPostsById() {
    if (this.userData) {
      this.firestoreService.getPostsByUserId(this.userData.personalInfo.userId).orderBy('date', this.postsOrder$.getValue()).limit(2)
        .onSnapshot((res: QuerySnapshot<ImagePost>) => {
          if (res) {
            console.log('change!');
            this.userImagePosts = [];
            res.docs.forEach(post => {
              this.userImagePosts.push(post.data());
            });
          }
        });
    }
  }

  public orderBy(value: OrderByDirection) {
    this.postsOrder$.next(value);
  }

  public deletePost(imagePostToDelete: ImagePost) {
    this.firestoreService.deleteImagePost(imagePostToDelete).then(() => {
      this.snackBar.open('Posted removed', 'dismiss', {
        duration: 5000
      });
    });
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
  // @todo if firestore observable doesnt return, user doesnt exist, -> login page
}
