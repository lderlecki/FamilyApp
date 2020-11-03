import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from "./components/account/login/login.component";
import {RegisterComponent} from "./components/account/register/register.component";
import {CalendarComponent} from './components/calendar/calendar.component';
import {ListFamilyComponent} from './views/list-families/list-family.component';
import {PasswordResetComponent} from "./components/account/password-reset/password-reset.component";
import {ResponseResetPasswordComponent} from "./components/account/response-reset-password/response-reset-password.component";
import {AuthGuard} from "./_helpers/auth.guards";
import {ProfileComponent} from "./components/account/profile/profile.component";

const routes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: 'account/login', component: LoginComponent},
  {path: 'account/password-reset', component: PasswordResetComponent},
  {path: 'account/profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'password-reset-confirm/:uidb64/:token', component: ResponseResetPasswordComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'calendar', component: CalendarComponent},
  {path: 'families', component: ListFamilyComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
