import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {CustomValidators} from "../../../_helpers/custom-validators";

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
  matcher = new EmailErrorStateMatcher();
  public registerForm: FormGroup;
  public profileForm: FormGroup;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.compose([
        Validators.required,
        CustomValidators.patternValidator(/\d/, {hasNumber: true}),
        CustomValidators.patternValidator(/[A-Z]/, {hasCapitalCase: true}),
        CustomValidators.patternValidator(/[a-z]/, {hasSmallCase: true}),
        Validators.minLength(8)
      ])],
      password2: ['', Validators.compose([Validators.required])],
    },
      {
        validator: CustomValidators.passwordMatchValidator
      });
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', Validators.required],
      phoneNumber: ['', Validators.required],
    });
  }

  get emailFormControl() {
    return this.registerForm.get('email');
  }

  registerUser(registerData, profileData) {
    console.log(registerData);
    console.log(profileData);
    this.userService.registerUser(registerData, profileData).subscribe(
      response => {
        console.log(response);
      },
      error => console.log(error)
    );
  }

}
