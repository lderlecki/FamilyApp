import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {ToastrModule} from 'ngx-toastr';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {LoginComponent} from './views/account/login/login.component';
import {RegisterComponent} from './views/account/register/register.component';
import {CalendarComponent} from './components/calendar/calendar.component';
import {UserService} from './services/user.service';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MyTableComponent} from './components/tables/list-users-families-table/my-table.component';
import {ListFamilyComponent} from './views/familyProfileSearch/list-families/list-family.component';
import {CookieService} from 'ngx-cookie-service';
import {PasswordResetComponent} from './views/account/password-reset/password-reset.component';
import {ResponseResetPasswordComponent} from './views/account/response-reset-password/response-reset-password.component';
import {ListInvitationTableComponent} from './components/tables/list-invitation-table/list-invitation-table.component';
import {ListProfileComponent} from './views/familyProfileSearch/list-profiles/list-profile.component';
import {InviteToFamilyDialogComponent} from './components/dialogs/invite-to-family/invite-to-family-dialog';
import {MyFamilyComponent} from './views/my-family/my-family.component';
import {FamilyMembersComponent} from './views/my-family/family-members/family-members.component';
import {FamilyTasksComponent} from './views/my-family/family-tasks/family-tasks.component';
import {FamilyInvitationsComponent} from './views/my-family/list-family-invitations/family-invitations.component';
import {ErrorInterceptor} from './_helpers/error.interceptor';
import {ProfileComponent} from './views/account/profile/profile.component';
import {JwtInterceptor} from './_helpers/jwt.interceptor';
import {MainpageComponent} from './views/mainpage/mainpage.component';
import {FamilyProfileSearchComponent} from './views/familyProfileSearch/family-profile-search.component';
import {SpinnerComponent} from './components/spinner/spinner.component';


export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    ListFamilyComponent,
    AppComponent,
    LoginComponent,
    RegisterComponent,
    CalendarComponent,
    MyTableComponent,
    PasswordResetComponent,
    ResponseResetPasswordComponent,
    ListInvitationTableComponent,
    ListProfileComponent,
    InviteToFamilyDialogComponent,
    MyFamilyComponent,
    FamilyMembersComponent,
    FamilyTasksComponent,
    FamilyInvitationsComponent,
    ProfileComponent,
    MainpageComponent,
    FamilyProfileSearchComponent,
    SpinnerComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    ToastrModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    TranslateModule.forRoot(),
    HttpClientModule,
  ],
  providers: [
    {provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient]},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
