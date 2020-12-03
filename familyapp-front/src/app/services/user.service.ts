import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  BASE_URL = environment.djangoApiUrl;
  private registerUrl = 'register/';
  private apiAuthUrl = 'token/';
  private profileDataUrl = 'profiles/';
  private changePasswordUrl = 'change-password/';
  private requestPasswordResetUrl = 'request-reset-email/';
  private passwordResetTokenValidateUrl = 'password-reset/';
  private passwordResetCompleteUrl = 'password-reset-complete/';
  private tokenRefreshUrl = 'password-reset-complete/';

  private httpHeaders: HttpHeaders;
  private params: HttpParams;
  private AUTH_PREFIX = 'Bearer';


  constructor(private http: HttpClient) {
  }

  registerUser(userData, profileData): Observable<any> {
    const data = {
      'userData': userData,
      'profileData': profileData,
    };
    console.log(data);
    return this.http.post(this.BASE_URL + this.registerUrl, data);
  }

  loginUser(loginData): Observable<any> {
    return this.http.post(this.BASE_URL + this.apiAuthUrl, loginData, {observe: 'response'});
  }

  getProfileData(token, user_id): Observable<any> {
    return this.http.get(this.BASE_URL + this.profileDataUrl + `${user_id}/`);
  }

  updateProfileData(token, user_id, data): Observable<any> {
    return this.http.patch(this.BASE_URL + this.profileDataUrl + `${user_id}/`, data);
  }
  changeUserPassword(data): Observable<any> {
    return this.http.patch(this.BASE_URL + this.changePasswordUrl, data, {observe: 'response'});
  }

  requestPasswordReset(email: string): Observable<any> {
    const data = {email: email};
    return this.http.post(this.BASE_URL + this.requestPasswordResetUrl, data, {observe: 'response'});
  }

  passwordTokenValidation(uidb64: string, token: string): Observable<any> {
    return this.http.get(this.BASE_URL + this.passwordResetTokenValidateUrl + `${uidb64}/${token}`, {observe: 'response'});
  }

  updatePassword(password: string, password2: string, uidb64: string, token: string): Observable<any> {
    const data = {
      password: password,
      password_repeat: password2,
      uidb64: uidb64,
      token: token
    };
    return this.http.patch(this.BASE_URL + this.passwordResetCompleteUrl, data, {observe: 'response'});
  }


}
