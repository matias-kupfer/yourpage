import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {ProfileComponent} from '../profile.component';
import {User} from '../../../interfaces/user';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DefaultRegex} from '../../../enums/regex.enum';

@Component({
  selector: 'app-edit-bio',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  newData: FormGroup;
  socialProfiles: string[] = ['facebook', 'github', 'twitter', 'youtube', 'linkedin', 'instagram'];

  constructor(
    public dialogRef: MatDialogRef<ProfileComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public userData: User) {
  }

  ngOnInit() {
    this.newData = new FormGroup({
      bio: new FormControl(this.userData.accountInfo.bio, [
        Validators.maxLength(200),
      ]),
      facebook: new FormControl(this.userData.accountInfo.socialLinks.facebook, [
        Validators.pattern(DefaultRegex.secureUrl),
        Validators.maxLength(50)
      ]),
      github: new FormControl(this.userData.accountInfo.socialLinks.github, [
        Validators.pattern(DefaultRegex.secureUrl),
        Validators.maxLength(50)
      ]),
      twitter: new FormControl(this.userData.accountInfo.socialLinks.twitter, [
        Validators.pattern(DefaultRegex.secureUrl),
        Validators.maxLength(50)
      ]),
      youtube: new FormControl(this.userData.accountInfo.socialLinks.youtube, [
        Validators.pattern(DefaultRegex.secureUrl),
        Validators.maxLength(50)
      ]),
      linkedin: new FormControl(this.userData.accountInfo.socialLinks.linkedin, [
        Validators.pattern(DefaultRegex.secureUrl),
        Validators.maxLength(50)
      ]),
      instagram: new FormControl(this.userData.accountInfo.socialLinks.instagram, [
        Validators.pattern(DefaultRegex.secureUrl),
        Validators.maxLength(50)
      ]),
    });
  }

  get bio() {
    return this.newData.get('bio');
  }

  get facebook() {
    return this.newData.get('facebook');
  }

  get github() {
    return this.newData.get('github');
  }

  get twitter() {
    return this.newData.get('twitter');
  }

  get youtube() {
    return this.newData.get('youtube');
  }

  get linkedin() {
    return this.newData.get('linkedin');
  }

  get instagram() {
    return this.newData.get('instagram');
  }

  saveData() {
    this.userData.accountInfo.bio = this.bio.value;
    this.userData.accountInfo.socialLinks = {
      facebook: this.facebook.value,
      github: this.github.value,
      twitter: this.twitter.value,
      youtube: this.facebook.value,
      linkedin: this.linkedin.value,
      instagram: this.instagram.value,
    };
    this.dialogRef.close(this.userData);
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
