import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  API_REGISTER_URL = 'http://0.0.0.0:8000/api/register/';

  private httpHeaders: HttpHeaders;
  private params: HttpParams;

  constructor(private http: HttpClient) {  }

  registerUser(userData): Observable<any> {
    return this.http.post(this.API_REGISTER_URL, userData);
  }

}
