import {Component, Inject, OnInit} from '@angular/core';
import {UploadFile} from '../../../class/uploadFile';
import {FirestoreService} from '../../../core/services/firestore.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {User} from '../../../class/user';
import {ProfileComponent} from '../profile.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-picture',
  templateUrl: './change-picture.component.html',
  styleUrls: ['./change-picture.component.scss']
})
export class ChangePictureComponent implements OnInit {
  hover = false;
  files: UploadFile[] = [];
  uploading = false;

  constructor(private firestoreService: FirestoreService,
              private snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<ProfileComponent>,
              @Inject(MAT_DIALOG_DATA) public userData: User) {
  }

  ngOnInit() {
  }

  updateProfileImage() {
    this.uploading = true;
    this.firestoreService.uploadImagesFireStorage(this.files, this.userData).then(() => {
      this.snackBar.open('Profile picture updated successfully', 'dismiss', {
        duration: 5000
      });
      this.uploading = false;
    });
  }

  emptyFiles() {
    this.files = [];
  }

}
