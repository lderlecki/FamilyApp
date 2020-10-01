import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import {ErrorStateMatcher} from "@angular/material/core";

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
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loginData = {
    email: '',
    password: '',
    };
  }
  loginUser() {
    this.userService.loginUser(this.loginData).subscribe(
      response => {
        console.log(response['access']);
        sessionStorage.setItem('access', response['access']);
        sessionStorage.setItem('refresh', response['refresh']);
      },
      error => console.log(error)
    );
  }

  generateTokenViaSpring(): void {
    this.userService.attemptAuthViaSpring(this.loginData.email, this.loginData.password).subscribe(
      data => {
       console.log('token generated via spring \n' + data.token.token);
      }
    );
  }

}
