import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UploadFile} from '../../../class/uploadFile';

@Component({
  selector: 'app-file-upload-card',
  templateUrl: './file-upload-card.component.html',
  styleUrls: ['./file-upload-card.component.scss']
})
export class FileUploadCardComponent implements OnInit {

  @Input() uploadFile: UploadFile;
  @Input() isUploading: boolean;
  @Output() remove = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

  public onRemove() {
    this.remove.emit(this.uploadFile.fileName);
  }

}
