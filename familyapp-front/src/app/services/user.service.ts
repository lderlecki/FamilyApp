import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  BASE_URL = 'http://localhost:8000/api/';
  private registerUrl = 'register/';
  private apiAuthUrl = 'token/';
  private profileDataUrl = 'profiles/';
  private requestPasswordResetUrl = 'request-reset-email/';
  private passwordResetTokenValidateUrl = 'password-reset/';
  private passwordResetCompleteUrl = 'password-reset-complete/';

  private httpHeaders: HttpHeaders;
  private params: HttpParams;


  constructor(private http: HttpClient) {
  }

  attemptAuthViaSpring(email: string, password: string): Observable<any> {
    const credentials = {email: email, password: password};
    console.log('attemptAuth');
    return this.http.post<any>('http://localhost:8081/token/generate-token', credentials);
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
    this.httpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.get(this.BASE_URL + this.profileDataUrl + `${user_id}/`, {headers: this.httpHeaders});
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
