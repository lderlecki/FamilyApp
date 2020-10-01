import {Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';

export class EmailErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [UserService],
})
export class RegisterComponent implements OnInit {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  matcher = new EmailErrorStateMatcher();
  registerData;
  profileData;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.registerData = {
      email: '',
      password: '',
      password2: '',
    };
    this.profileData = {
      name: '',
      surname: '',
      phoneNumber: '',
    };
  }

  registerUser() {
    this.userService.registerUser(this.registerData, this.profileData).subscribe(
      response => {
        console.log(response);
      },
      error => console.log(error)
    );
  }

}
