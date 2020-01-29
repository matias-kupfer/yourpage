import {Component, Inject, OnInit} from '@angular/core';
import {UploadFile} from '../../../class/uploadFile';
import {FirestoreService} from '../../../core/services/firestore.service';
import {MAT_DIALOG_DATA} from '@angular/material';
import {User} from '../../../interfaces/user';

@Component({
  selector: 'app-change-picture',
  templateUrl: './change-picture.component.html',
  styleUrls: ['./change-picture.component.scss']
})
export class ChangePictureComponent implements OnInit {

  hover = false;
  files: UploadFile[] = [];

  constructor(private firestoreService: FirestoreService,
              @Inject(MAT_DIALOG_DATA) public userData: User) {
  }

  uploadImages() {
    this.firestoreService.loadImagesFirebase(this.files, this.userData);
  }

  overElement(event) {
    console.log(event);
  }

  emptyFiles() {
    this.files = [];
  }

  ngOnInit() {
  }

}
// @todo allow only 1 image upload
