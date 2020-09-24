import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService],
})
export class RegisterComponent implements OnInit {
  registerData;
  constructor(private userService: UserService ) { }

  ngOnInit(): void {
    this.registerData = {
    email: '',
    password: '',
    password2: '',
    };
  }
  registerUser() {
    this.userService.registerUser(this.registerData).subscribe(
      response => {
        alert('User has been created.');
      },
      error => console.log(error)
    );
  }

}
