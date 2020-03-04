export class UploadFile {
  public file: File;
  public fileName: string;
  public url: string;
  public uploading: boolean;
  public progress: number;
  public previewUrl: string;

  constructor(file: File, previewUrl: any) {
    this.file = file;
    this.fileName = file.name;
    this.uploading = false;
    this.progress = 0;
    this.previewUrl = previewUrl;
  }
}
