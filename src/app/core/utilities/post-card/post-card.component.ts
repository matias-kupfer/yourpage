import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ImagePost} from '../../../class/imagePost';
import {Comment} from '../../../class/comment';
import {User} from '../../../class/user';
import {AuthService} from '../../services/auth.service';
import {FirestoreService} from '../../services/firestore.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DefaultRoutes} from '../../../enums/default.routes';
import {ApiResponse} from '../../../interfaces/api-response';
import {Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import * as firebase from 'firebase';
import {MapsAPILoader} from '@agm/core';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {
  private geoCoder;
  location: string;
  zoom = 6;
  lat: number;
  lng: number;

  public sliderIndex = 0;
  public authUser = this.authService.user$.getValue();
  public isPostOwner: boolean;
  public newComment: string;
  public commentLoader = false;
  public profilePictures: any[] = [];

  @Input() post: ImagePost;
  @Input() postUser: User;
  @Input() showFollowButton: boolean;
  @Output() deletePost: EventEmitter<ImagePost> = new EventEmitter();


  constructor(public authService: AuthService,
              private firestoreService: FirestoreService,
              private snackBar: MatSnackBar,
              private router: Router,
              private apiService: ApiService,
              private mapsAPILoader: MapsAPILoader) {
  }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
      if (this.geoCoder !== undefined) {
        this.findLocation().then(() => {
          if (this.postUser === null) {
            this.firestoreService.getUserById(this.post.userId).get().then(user => {
              this.postUser = user.data();
              this.setConfig();
            }).catch(e => console.log(e));
          } else {
            this.setConfig();
          }
        });
      }
    });
  }

  public setConfig() {
    this.isPostOwner = this.authService.isLoggedIn && this.authUser.personalInfo.userId === this.postUser.personalInfo.userId;
    for (const comment of this.post.comments) {
      this.getUserImage(comment.commentUsername);
    }
  }

  public emitDeletePost() {
    this.deletePost.emit(this.post);
  }

  public postComment() {
    this.commentLoader = true;
    const newComment = JSON.parse(JSON.stringify(new Comment(this.authUser.accountInfo.userName, this.newComment)));
    newComment.date = firebase.firestore.Timestamp.now();
    this.post.comments.push(newComment);
    this.firestoreService.updatePost(this.post, this.postUser.personalInfo.userId).then(() => {
      this.getUserImage(this.authUser.accountInfo.userName);
      this.newComment = undefined;
      this.commentLoader = false;
      this.snackBar.open('Comment posted', 'dismiss', {
        duration: 5000
      });
    }).catch(e => {
      this.snackBar.open('Error posting comment', 'dismiss', {
        duration: 5000
      });
      console.log(e);
    });
  }

  public toggleLikePost() {
    if (this.liked) {
      this.post.likes.forEach((userId, index) => {
        if (userId === this.authUser.personalInfo.userId) {
          this.post.likes.splice(index, 1);
        }
      });
    } else {
      this.post.likes.push(this.authUser.personalInfo.userId);
    }
    this.firestoreService.updatePost(this.post, this.postUser.personalInfo.userId).catch(e => {
      this.snackBar.open('Error trying to like post', 'dismiss', {
        duration: 5000
      });
      console.log(e);
    });
  }

  public toggleLikeComment(position: number) {
    this.post.comments[position].liked = !this.post.comments[position].liked;
    this.firestoreService.updatePost(this.post, this.postUser.personalInfo.userId).catch(e => {
      this.snackBar.open('Error trying to like comment', 'dismiss', {
        duration: 5000
      });
      console.log(e);
    });
  }

  public get liked() {
    return this.authService.isLoggedIn && this.post.likes.find(userId => this.authUser.personalInfo.userId === userId);
  }

  public getUserImage(username: string) {
    if (this.findUser(username, false)) {
      return;
    }
    this.firestoreService.getUserByUserName(username).get().then(response => {
      if (response.docs[0].exists) {
        this.profilePictures.push({username, url: response.docs[0].data().accountInfo.imageUrl});
      }
    }).catch(e => console.log(e));
  }

  public findUser(username: string, response: boolean) {
    for (const user of this.profilePictures) {
      if (user.username === username) {
        return response ? user.url : true;
      }
    }
    return false;
  }

  public toggleFollow(action: string) {
    if (!this.authService.isLoggedIn) { // not logged in cannot follow
      this.router.navigate([DefaultRoutes.OnLoginButtonClick]);
      return;
    }
    this.apiService.toggleFollow(this.postUser.personalInfo.userId, action).subscribe((r: ApiResponse) => {
      if (!r.success) {
        this.snackBar.open(r.message, 'dismiss', {
          duration: 4000, /*not working*/
        });
      }
    });
  }

  public isFollowing() {
    for (const following of this.authService.user$.getValue().following) {
      if (following === this.postUser.personalInfo.userId) {
        return true;
      }
    }
    return false;
  }

  async findLocation() {
    await this.geoCoder.geocode({placeId: this.post.placeId}, (results, status) => {
      if (results.length) {
        this.location = results[0].formatted_address;
        this.lat = results[0].geometry.location.lat();
        this.lng = results[0].geometry.location.lng();
      }
    });
  }
}
