import {Component, OnInit} from '@angular/core';
import {TokenAuthService} from '../../../services/tokenAuth.service';
import {UserService} from '../../../services/user.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public profileData: any;
  public password: string;
  public newPassword: string;
  public newPassword2: string;

  constructor(
    public authService: TokenAuthService,
    private userService: UserService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.profileData = JSON.parse(localStorage.getItem('profile'));
  }

  updateProfileData() {
    const token = this.authService.getToken();
    const uid = this.authService.getUid();
    this.userService.updateProfileData(token, uid, this.profileData).subscribe(
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

  changePassword() {
    const data = {
      old_password: this.password,
      new_password: this.newPassword,
      new_password2: this.newPassword,
    };
    this.userService.changeUserPassword(data).subscribe(
      response => {
        this.toastr.success('Password changed successfully');
      }, error => {
        this.toastr.error('Error, please try again.');
      }
    );
  }

}
