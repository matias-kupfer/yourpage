import {Component, Inject, OnInit} from '@angular/core';
import {UploadFile} from '../../../class/uploadFile';
import {FirestoreService} from '../../../core/services/firestore.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {User} from '../../../class/user';
import {ProfileComponent} from '../profile.component';

@Component({
  selector: 'app-change-picture',
  templateUrl: './change-picture.component.html',
  styleUrls: ['./change-picture.component.scss']
})
export class ChangePictureComponent implements OnInit {
  hover = false;
  preview: string;
  files: UploadFile[] = [];

  constructor(private firestoreService: FirestoreService,
              public dialogRef: MatDialogRef<ProfileComponent>,
              @Inject(MAT_DIALOG_DATA) public userData: User) {
  }

  ngOnInit() {
  }

  updateProfileImage() {
    this.firestoreService.uploadImagesFirebase(this.files, this.userData);
  }

  emptyFiles() {
    this.files = [];
  }

}
