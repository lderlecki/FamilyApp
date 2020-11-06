import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './views/account/login/login.component';
import {RegisterComponent} from './views/account/register/register.component';
import {ListFamilyComponent} from './views/list-families/list-family.component';
import {PasswordResetComponent} from './views/account/password-reset/password-reset.component';
import {ResponseResetPasswordComponent} from './views/account/response-reset-password/response-reset-password.component';
import {ListInvitationComponent} from './views/list-invitations/list-invitation.component';
import {ListProfileComponent} from './views/list-profiles/list-profile.component';
import {MyFamilyComponent} from './views/my-family/my-family.component';
import {FamilyMembersComponent} from './views/my-family/family-members/family-members.component';
import {FamilyTasksComponent} from './views/my-family/family-tasks/family-tasks.component';
import {FamilyInvitationsComponent} from './views/my-family/list-family-invitations/family-invitations.component';
import {AuthGuard} from './_helpers/auth.guards';
import {ProfileComponent} from './views/account/profile/profile.component';
import {MainpageComponent} from './views/mainpage/mainpage.component';


const routes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: '',  component: MainpageComponent},
  {path: 'account/login', component: LoginComponent},
  {path: 'account/password-reset', component: PasswordResetComponent},
  {path: 'account/profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'password-reset-confirm/:uidb64/:token', component: ResponseResetPasswordComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profiles', component: ListProfileComponent},
  {path: 'invitationsForProfile', component: ListInvitationComponent},
  {
    path: 'myFamily', children: [
      {
        path: 'members',
        component: FamilyMembersComponent,
      },
      {
        path: 'tasks',
        component: FamilyTasksComponent,
      },
      {
        path: 'invitations',
        component: FamilyInvitationsComponent,
      },
    ], component: MyFamilyComponent
  },
  {path: 'families', component: ListFamilyComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
