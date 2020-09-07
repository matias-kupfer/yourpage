import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {UploadFile} from '../../../class/uploadFile';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ImagePost} from '../../../class/imagePost';
import {AuthService} from '../../../core/services/auth.service';
import {FirestoreService} from '../../../core/services/firestore.service';
import {User} from '../../../class/user';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef} from '@angular/material';
import {mapStyle} from '../../../enums/map-style.enum';
import {MapsAPILoader} from '@agm/core';

@Component({
  selector: 'app-new-image-post',
  templateUrl: './new-image-post.component.html',
  styleUrls: ['./new-image-post.component.scss']
})
export class NewImagePostComponent implements OnInit {
  public mapStyle: any = mapStyle;
  private geoCoder;
  latitude = 1;
  longitude = 1;
  placeId: string;
  zoom = 1;
  address = 'No location selected';

  @ViewChild('search', null)
  public searchElementRef: ElementRef;

  hover = false;
  files: UploadFile[] = [];
  filesLimit = 5;
  newPostForm: FormGroup;
  isUploading = false;

  constructor(
    public dialogRef: MatDialogRef<NewImagePostComponent>,
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private snackBar: MatSnackBar,
    private firestoreService: FirestoreService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {
  }

  ngOnInit() {
    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();

      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.address = place.formatted_address;
          this.placeId = place.place_id;
          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          // set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 10;
        });
      });
    });

    this.newPostForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
      ]),
      caption: new FormControl('', [
        Validators.maxLength(200),
        Validators.required,
      ]),
    });
  }

  get title() {
    return this.newPostForm.get('title');
  }

  get caption() {
    return this.newPostForm.get('caption');
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({location: {lat: latitude, lng: longitude}}, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 10;
          this.address = results[0].formatted_address;
          this.placeId = results[0].place_id;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  public post() {
    this.isUploading = !this.isUploading;
    const user: User = this.authService.user$.getValue();
    const newImagePost = new ImagePost(user.personalInfo.userId, this.title.value, this.caption.value, this.placeId);
    this.firestoreService.newImagePost(JSON.parse(JSON.stringify(newImagePost)), this.files, this.authService.user$.getValue())
      .then(() => {
        this.isUploading = !this.isUploading;
        this.snackBar.open('Posted successfully', 'dismiss', {
          duration: 5000
        });
        this.dialogRef.close();
      });
    // todo image description on each
  }

  public removeImage(filename) {
    this.files.forEach((file, index) => {
      if (file.fileName === filename) {
        this.files.splice(index, 1);
      }
    });
  }
}


