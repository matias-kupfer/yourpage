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

import {NotifierModule, NotifierOptions} from 'angular-notifier';
import {AgmCoreModule} from '@agm/core';

import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule, MatInputModule, MatNativeDateModule} from '@angular/material';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {LoaderComponent} from './components/loader/loader.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatBadgeModule} from '@angular/material/badge';


@NgModule({
  entryComponents: [
    EditProfileComponent,
    EditPointerComponent
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
    FormsModule
  ],
  providers: [
    AuthenticationGuard,
    MatDatepickerModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
