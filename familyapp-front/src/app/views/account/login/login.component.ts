import {Component, Injectable, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {TokenAuthService} from '../../../services/tokenAuth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from "ngx-toastr";

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
  matcher = new EmailErrorStateMatcher();
  private returnUrl: any;
  public loginForm: FormGroup;

  constructor(
    private userService: UserService,
    public authService: TokenAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit(): void {
    if (this.authService.profileValue) {
      this.router.navigate(['account/profile']);
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'];
    });
  }

  get emailFormControl() {
    return this.loginForm.get('email');
  }

  loginUser(loginData) {
    this.userService.loginUser(loginData).subscribe(
      response => {
        if (response.status === 200 && response.ok) {
          console.log('logged in');
          const body = response['body'];
          const accessToken = body['access'];
          const uid = body['uid'];
          this.authService.set('access', accessToken, true);
          this.authService.set('refresh', body['refresh'], true);
          this.getUserData(accessToken, uid);
        }
      },
      error => {
        console.log('LOGIN ERROR');
        console.log(error.error);
        const errMsg = error.error['detail'];
        if (errMsg !== null) {
          this.toastr.error(errMsg);
        } else {
          this.toastr.error('Unknown error occurred.\nPlease try again.');
        }
      }
    );
  }
  logout() {
    this.authService.logout();
  }

  getUserData(accessToken, user_id) {
    console.log('GET USER DATA');
    this.userService.getProfileData(accessToken, user_id).subscribe(
      response => {
        // if (response.family !== null) {
        //   response.family = this.keysToCamel(response.family);
        //   console.log('family to camel case: ', response.family);
        // }
        localStorage.setItem('profile', JSON.stringify(response));
        this.authService.login(accessToken, user_id, response);

        if (this.returnUrl === undefined) {
          this.router.navigate(['account/profile']);
        } else {
          this.router.navigate([this.returnUrl]);
        }

      },
      err => {
        this.logout();
        this.toastr.error('Error occurred.\nPlease try again.');
        console.log(err);
      }
    );
  }

  // toCamel(s: string) {
  //   return s.replace(/([-_][a-z])/ig, ($1) => {
  //     return $1.toUpperCase()
  //       .replace('-', '')
  //       .replace('_', '');
  //   });
  // }
  //
  // keysToCamel(o: any) {
  //   if (o === Object(o) && !Array.isArray(o) && typeof o !== 'function') {
  //     const n = {};
  //     Object.keys(o)
  //       .forEach((k) => {
  //         n[this.toCamel(k)] = this.keysToCamel(o[k]);
  //       });
  //     return n;
  //   } else if (Array.isArray(o)) {
  //     return o.map((i) => {
  //       return this.keysToCamel(i);
  //     });
  //   }
  //   return o;
  // }


}
