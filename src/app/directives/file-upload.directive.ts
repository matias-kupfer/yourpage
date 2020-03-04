import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {UploadFile} from '../class/uploadFile';
import {MatDialog} from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';

@Directive({
  selector: '[appFileUpload]'
})
export class FileUploadDirective {

  @Input() files: UploadFile[] = [];
  @Input() limit: number = null;
  @Output() customMouseOver: EventEmitter<boolean> = new EventEmitter();
  @Output() urls: EventEmitter<string[]> = new EventEmitter();

  constructor(private snackBar: MatSnackBar) {
  }

  @HostListener('dragover', ['$event'])
  public onDragEnter(event: any) {
    this.customMouseOver.emit(true);
    this._preventAndStop(event);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any) {
    this.customMouseOver.emit(false);
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: any) {
    const transfer = this._getTransfer(event);
    if (!transfer) {
      return;
    }

    this._getFiles(transfer.files);

    this._preventAndStop(event);
    this.customMouseOver.emit(false);

  }

  private _getTransfer(event: any) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTranser;
  }

  private _getFiles(filesList: FileList) {
    if (filesList.length > this.limit) {
      this.snackBar.open('Files remaining is ' + this.limit + ' file(s)', '', {
        duration: 5000
      });
      return;
    }
    // tslint:disable-next-line:forin
    for (const property in Object.getOwnPropertyNames(filesList)) {
      const tempFile = filesList[property];

      if (this._canUpload(tempFile)) {
        const reader = new FileReader();
        reader.readAsDataURL(tempFile);
        reader.onloadend = () => {
          const newFile = new UploadFile(tempFile, reader.result);
          this.files.push(newFile);
        };
      }
    }
  }

  private _canUpload(file: File): boolean {
    if (this._isImage(file.type) && !this._fileDropped(file.name)) {
      return true;
    } else {
      if (!this._isImage(file.type)) {
        this.snackBar.open('Drop files of type image only', '', {
          duration: 5000
        });
      } else {
        this.snackBar.open('The file has already been uploaded', '', {
          duration: 5000
        });
      }
      return false;
    }
  }

  private _preventAndStop(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  private _fileDropped(fileName: string): boolean {
    for (const file of this.files) {
      if (file.fileName === fileName) {
        this.snackBar.open('The file has alredy been uploaded', '', {
          duration: 5000
        });
        return true;
      }
    }
    return false;
  }

  private _isImage(fileType: string): boolean {
    return (fileType === '' || fileType === undefined) ? false : fileType.startsWith('image');
  }

}
