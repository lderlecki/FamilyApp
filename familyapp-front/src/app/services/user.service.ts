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
  private profileDataUrl = 'get_user_data/';

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
    return this.http.post(this.BASE_URL + this.registerUrl, data);
  }

  loginUser(loginData): Observable<any> {
    return this.http.post(this.BASE_URL + this.apiAuthUrl, loginData, {observe: 'response'});
  }

  getProfileData(token): Observable<any> {
    this.httpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.get(this.BASE_URL + this.profileDataUrl, {headers: this.httpHeaders});
  }


}
