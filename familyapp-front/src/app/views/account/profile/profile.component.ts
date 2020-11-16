import {Component, OnInit} from '@angular/core';
import {TokenAuthService} from '../../../services/tokenAuth.service';
import {UserService} from '../../../services/user.service';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../../../_helpers/custom-validators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public profileData: any;
  public profileForm: FormGroup;
  public passwordForm: FormGroup;

  constructor(
    public authService: TokenAuthService,
    private userService: UserService,
    private toastr: ToastrService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.profileData = this.authService.profileValue;
    this.profileForm = this.fb.group({
      name: [this.profileData.name, Validators.required],
      email: [this.profileData.email, Validators.required],
      surname: [this.profileData.surname, Validators.required],
      phone: [this.profileData.phone, Validators.required],
    });
    this.passwordForm = this.fb.group({
      old_password: ['', Validators.required],
      password: ['', Validators.compose([
        Validators.required,
        CustomValidators.patternValidator(/\d/, {hasNumber: true}),
        CustomValidators.patternValidator(/[A-Z]/, {hasCapitalCase: true}),
        CustomValidators.patternValidator(/[a-z]/, {hasSmallCase: true}),
        Validators.minLength(8)
      ])],
      password2: ['', Validators.compose([Validators.required])],
    }, {
      validator: CustomValidators.passwordMatchValidator
    });
  }

  updateProfileData(data) {
    const token = this.authService.token;
    const uid = this.authService.uid;
    this.userService.updateProfileData(token, uid, data).subscribe(
      response => {
        this.toastr.success('Personal data updated successfully');
        localStorage.setItem('profile', JSON.stringify(response));
      }, error => {
        console.log(error);
        this.toastr.error('Error, please try again.');
      }
    );
    console.log(this.profileData);
  }

  changePassword(data) {
    this.userService.changeUserPassword(data).subscribe(
      response => {
        this.toastr.success('Password changed successfully');
        this.passwordForm.reset();
      }, error => {
        this.toastr.error('Error, please try again.');
      }
    );
  }

}
