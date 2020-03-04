import {Component, OnInit} from '@angular/core';
import {UploadFile} from '../../../class/uploadFile';
import {of} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DefaultRegex} from '../../../enums/regex.enum';
import {ImagePost} from '../../../class/imagePost';
import {AuthService} from '../../../core/services/auth.service';
import {FirestoreService} from '../../../core/services/firestore.service';
import {User} from '../../../class/user';

@Component({
  selector: 'app-new-image-post',
  templateUrl: './new-image-post.component.html',
  styleUrls: ['./new-image-post.component.scss']
})
export class NewImagePostComponent implements OnInit {
  hover = false;
  files: UploadFile[] = [];
  filesLimit = 5;
  newPostForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private firestoreService: FirestoreService) {
  }

  ngOnInit() {
    this.newPostForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(15),
      ]),
      caption: new FormControl('', [
        Validators.maxLength(200),
      ]),
    });
  }

  get title() {
    return this.newPostForm.get('title');
  }

  get caption() {
    return this.newPostForm.get('caption');
  }

  public post() {
    const user: User = this.authService.user$.getValue();
    const newImagePost = new ImagePost(user.personalInfo.userId, this.title.value, this.caption.value);
    this.firestoreService.newImagePost(JSON.parse(JSON.stringify(newImagePost)), this.files, this.authService.user$.getValue());
    // todo image description on each
  }
}
