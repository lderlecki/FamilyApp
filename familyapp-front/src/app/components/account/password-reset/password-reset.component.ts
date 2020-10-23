import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {TokenAuthService} from "../../../services/tokenAuth.service";

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  email: '';

  constructor(
    private userService: UserService,
    private authService: TokenAuthService
  ) {
  }

  ngOnInit(): void {
    this.email = '';
  }

  resetPassword(): void {
    this.userService.requestPasswordReset(this.email).subscribe(
      response => {
        console.log(response);
      }, error => console.log(error)
    );
  }
}
