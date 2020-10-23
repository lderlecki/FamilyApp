import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from "./components/account/login/login.component";
import {RegisterComponent} from "./components/account/register/register.component";
import {CalendarComponent} from './components/calendar/calendar.component';
import {PasswordResetComponent} from "./components/account/password-reset/password-reset.component";
import {ResponseResetPasswordComponent} from "./components/account/response-reset-password/response-reset-password.component";

const routes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: 'account/login', component: LoginComponent},
  {path: 'account/password-reset', component: PasswordResetComponent},
  {path: 'password-reset-confirm/:uidb64/:token', component: ResponseResetPasswordComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'calendar', component: CalendarComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
