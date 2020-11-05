import {Component, Injectable, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {TokenAuthService} from '../../../services/tokenAuth.service';
import {ActivatedRoute, Router} from '@angular/router';

export class EmailErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [UserService],
})
export class LoginComponent implements OnInit {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  matcher = new EmailErrorStateMatcher();
  loginData;
  private returnUrl: any;

  constructor(
    private userService: UserService,
    public authService: TokenAuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.loginData = {
      email: '',
      password: '',
    };

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['account/profile']);
    }

    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'];
    });
  }

  loginUser() {
    this.userService.loginUser(this.loginData).subscribe(
      response => {
        console.log(response);
        if (response.status === 200 && response.ok) {
          console.log('logged in');
          const body = response['body'];
          const accessToken = body['access'];
          const uid = body['uid'];
          this.authService.set('access', accessToken);
          this.authService.set('refresh', body['refresh']);
          this.getUserData(accessToken, uid);
        }
      },
      err => console.log(err)
    );
  }

  logout() {
    this.authService.logout();
  }

  getUserData(accessToken, user_id) {
    this.userService.getProfileData(accessToken, user_id).subscribe(
      response => {
        localStorage.setItem('profile', JSON.stringify(response));
        this.authService.login(accessToken, user_id, response);

        if (this.returnUrl === undefined) {
          this.router.navigate(['account/profile']);
        } else {
          this.router.navigate([this.returnUrl]);
        }

      },
      err => console.log(err)
    );
  }

  // Do usunięcia?
  generateTokenViaSpring(): void {
    this.userService.attemptAuthViaSpring(this.loginData.email, this.loginData.password).subscribe(
      data => {
        console.log('token generated via spring \n' + data.token.token);
      }
    );
  }

}
