import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {environment} from '../environments/environment';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {DefaultKeys} from './enums/keys.enum';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/loginAndsignup/login/login.component';
import {AuthenticationGuard} from './core/guards/auth.guard';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {ProfileComponent} from './components/profile/profile.component';
import {NavbarComponent} from './core/utilities/navbar/navbar.component';
import {SignupComponent} from './components/loginAndsignup/signup/signup.component';
import {EditProfileComponent} from './components/profile/edit-profile/edit-profile.component';
import {EditPointerComponent} from './components/profile/edit-pointer/edit-pointer.component';
import {NewPostSelectorComponent} from './components/new-post/new-post-selector/new-post-selector.component';
import {NewTextPostComponent} from './components/new-post/new-text-post/new-text-post.component';
import {FileUploadDirective} from './directives/file-upload.directive';
import {ChangePictureComponent} from './components/profile/change-picture/change-picture.component';
import {NewUserDataComponent} from './components/profile/new-user-data/new-user-data.component';
import {NewImagePostComponent} from './components/new-post/new-image-post/new-image-post.component';
import {ImageComponent} from './core/utilities/image/image.component';

import {NotifierModule, NotifierOptions} from 'angular-notifier';
import {AgmCoreModule} from '@agm/core';

import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule, MatInputModule, MatListModule, MatNativeDateModule} from '@angular/material';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {LoaderComponent} from './core/utilities/loader/loader.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatBadgeModule} from '@angular/material/badge';
import {UsersListComponent} from './components/users-list/users-list.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatProgressBarModule} from '@angular/material/progress-bar';



@NgModule({
  entryComponents: [
    EditProfileComponent,
    EditPointerComponent,
    ChangePictureComponent,
    NewPostSelectorComponent,
    NewTextPostComponent,
    NewImagePostComponent
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NotFoundComponent,
    ProfileComponent,
    NavbarComponent,
    SignupComponent,
    LoaderComponent,
    EditProfileComponent,
    EditPointerComponent,
    UsersListComponent,
    NewPostSelectorComponent,
    NewTextPostComponent,
    FileUploadDirective,
    ChangePictureComponent,
    NewUserDataComponent,
    NewImagePostComponent,
    ImageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    NotifierModule,
    AgmCoreModule.forRoot({
      apiKey: DefaultKeys.maps
    }),
    // angular material
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatStepperModule,
    MatFormFieldModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatBadgeModule,
    FormsModule,
    MatSidenavModule,
    MatBottomSheetModule,
    MatListModule,
    MatProgressBarModule
  ],
  providers: [
    AuthenticationGuard,
    MatDatepickerModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
