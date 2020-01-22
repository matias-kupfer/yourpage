import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-edit-pointer',
  templateUrl: './edit-pointer.component.html',
  styleUrls: ['./edit-pointer.component.scss']
})
export class EditPointerComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditPointerComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
