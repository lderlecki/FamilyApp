import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {TokenAuthService} from "../../../services/tokenAuth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-response-reset-password',
  templateUrl: './response-reset-password.component.html',
  styleUrls: ['./response-reset-password.component.scss']
})
export class ResponseResetPasswordComponent implements OnInit {
  password: string;
  password2: string;
  uidb64: string;
  token: string;

  private sub: any;

  constructor(
    private userService: UserService,
    private authService: TokenAuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.uidb64 = params['uidb64'];
      this.token = params['token'];
    });
    this.validatePasswordToken();
  }

  savePassword(): void {
    this.userService.updatePassword(this.password, this.password2, this.uidb64, this.token).subscribe(
      response => {
        console.log(response);
        window.alert('Password reset success');
        this.router.navigate(['account/login']);
      }, error => console.log(error)
    );
  }

  validatePasswordToken(): void {
    this.userService.passwordTokenValidation(this.uidb64, this.token).subscribe(
      response => {
        console.log(response.status);
        if (response.status === 200) {
        }
      }, error => {
        console.log(error);
        this.router.navigate(['/']);
      }
    );
  }

}
