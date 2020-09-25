import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService],
})
export class LoginComponent implements OnInit {
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
        console.log(response);
        sessionStorage.setItem('access', response['access']);
        sessionStorage.setItem('refresh', response['refresh']);
      },
      error => console.log(error)
    );
  }

}
