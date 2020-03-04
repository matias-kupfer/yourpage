import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {User} from '../../../class/user';
import {UploadFile} from '../../../class/uploadFile';
import {FirestoreService} from '../../../core/services/firestore.service';

@Component({
  selector: 'app-new-text-post',
  templateUrl: './new-text-post.component.html',
  styleUrls: ['./new-text-post.component.scss']
})
export class NewTextPostComponent implements OnInit {
  hover = false;
  files: UploadFile[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: User,
              private firestoreService: FirestoreService) {
  }

  ngOnInit() {
  }

  uploadImages() {

  }

  emptyFiles() {
    this.files = [];
  }

}
