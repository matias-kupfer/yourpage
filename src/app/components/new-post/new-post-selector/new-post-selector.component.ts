import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MatDialog} from '@angular/material';
import {User} from '../../../class/user';
import {NewTextPostComponent} from '../new-text-post/new-text-post.component';
import {AppComponent} from '../../../app.component';
import {NewImagePostComponent} from '../new-image-post/new-image-post.component';

@Component({
  selector: 'app-new-post-selector',
  templateUrl: './new-post-selector.component.html',
  styleUrls: ['./new-post-selector.component.scss']
})
export class NewPostSelectorComponent implements OnInit {

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: User,
              private bottomSheetRef: MatBottomSheetRef<NewPostSelectorComponent>,
              public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  newTextPost() {
    this.bottomSheetRef.dismiss();
    const dialogRef = this.dialog.open(NewTextPostComponent, {
      width: '700px',
      data: this.data
    });
  }

  newImagePost() {
    this.bottomSheetRef.dismiss();
    const dialogRef = this.dialog.open(NewImagePostComponent, {
      width: '700px',
      data: this.data
    });
  }

}
