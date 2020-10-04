import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TokenAuthService extends CookieService {
  private BASE_URL = 'http://localhost:8000/api/';
  private ACCESS_AUTH_URL = 'validate/access/';
  private authorized = false;

  private httpHeaders: HttpHeaders;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    // @ts-ignore
    super(cookieService);
  }

  isAuthenticated() {
    return this.authorized;
  }

  authenticate(): void {
    console.log('authenticate user');
    const token = this.cookieService.get('access');
    this.httpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});
    this.http.get(this.BASE_URL + this.ACCESS_AUTH_URL, {headers: this.httpHeaders}).subscribe(
      response => {
        if (response['authenticated']) {
          this.authorized = true;
        }
      }, error => {
        console.log(error);
        this.authorized = false;
      }
    );
  }


}
