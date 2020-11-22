import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {environmentProd} from '../environments/environment.prod';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {HttpClientModule} from '@angular/common/http';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {DefaultKeys} from './enums/keys.enum';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';

export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
    pinch: {enable: false},
    rotate: {enable: false}
  } as any;
}

import {HomeComponent} from './components/home/home.component';
import {AuthenticateComponent} from './components/authenticate/authenticate.component';
import {AuthenticationGuard} from './core/guards/auth.guard';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {ProfileComponent} from './components/profile/profile.component';
import {NavbarComponent} from './core/utilities/navbar/navbar.component';
import {EditProfileComponent} from './components/profile/edit-profile/edit-profile.component';
import {EditPointerComponent} from './components/profile/edit-pointer/edit-pointer.component';
import {FileUploadDirective} from './directives/file-upload.directive';
import {NewUserDataComponent} from './components/profile/new-user-data/new-user-data.component';
import {NewImagePostComponent} from './components/posts/new-image-post/new-image-post.component';
import {ImageComponent} from './core/utilities/image/image.component';
import {UserCardComponent} from './core/utilities/user-card/user-card.component';
import {UsersListComponent} from './components/profile/users-list/users-list.component';


import {NotifierModule, NotifierOptions} from 'angular-notifier';
import {AgmCoreModule} from '@agm/core';

import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {
  MatChipsModule,
  MatDividerModule,
  MatExpansionModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule, MatRadioModule,
  MatRippleModule
} from '@angular/material';
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
import {UsersComponent} from './components/users/users.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {UserTableComponent} from './core/utilities/user-table/user-table.component';
import {PostCardComponent} from './core/utilities/post-card/post-card.component';
import {FileUploadCardComponent} from './core/utilities/file-upload-card/file-upload-card.component';
import {SearchComponent} from './components/search/search.component';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';


@NgModule({
  entryComponents: [
    EditProfileComponent,
    EditPointerComponent,
    NewImagePostComponent,
    UsersListComponent
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    AuthenticateComponent,
    NotFoundComponent,
    ProfileComponent,
    NavbarComponent,
    LoaderComponent,
    EditProfileComponent,
    EditPointerComponent,
    UsersComponent,
    FileUploadDirective,
    NewUserDataComponent,
    NewImagePostComponent,
    ImageComponent,
    UserCardComponent,
    UsersListComponent,
    UserTableComponent,
    PostCardComponent,
    FileUploadCardComponent,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environmentProd.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NotifierModule,
    AgmCoreModule.forRoot({
      apiKey: DefaultKeys.maps,
      libraries: ['places']
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
    MatProgressBarModule,
    MatTabsModule,
    MatChipsModule,
    MatExpansionModule,
    MatRippleModule,
    MatRadioModule
  ],
  providers: [
    AuthenticationGuard,
    MatDatepickerModule,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    },
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
