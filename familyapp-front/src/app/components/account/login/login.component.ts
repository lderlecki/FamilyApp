import {Component, Injectable, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {TokenAuthService} from '../../../services/tokenAuth.service';
import {CookieService} from "ngx-cookie-service";

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

  constructor(
    private userService: UserService,
    public authService: TokenAuthService,
    public cookieService: CookieService
  ) {
  }

  ngOnInit(): void {
    this.loginData = {
      email: '',
      password: '',
    };
  }

  loginUser() {
    this.userService.loginUser(this.loginData).subscribe(
      response => {
        console.log(response);
        if (response.status === 200 && response.ok) {
          console.log('logged in');
          const body = response['body'];
          const accessToken = body['access'];
          this.authService.set('access', accessToken);
          this.authService.set('refresh', body['refresh']);
          this.authService.authenticate();
          this.getUserData(accessToken, body['uid']);
          window.alert('User logged in');
        }

      },
      err => console.log(err)
    );
  }

  getUserData(accessToken, user_id) {
    // this.authService.isAuthenticated();
    this.userService.getProfileData(accessToken, user_id).subscribe(
      response => {
        window.localStorage.setItem('profile', JSON.stringify(response));
      },
      err => console.log(err)
    );
  }

  generateTokenViaSpring(): void {
    this.userService.attemptAuthViaSpring(this.loginData.email, this.loginData.password).subscribe(
      data => {
        console.log('token generated via spring \n' + data.token.token);
      }
    );
  }

  getAuthService() {
    return this.authService;
  }

}
