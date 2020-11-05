import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Profile} from '../models/profile';
import * as jwt_decode from 'jwt-decode';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class TokenAuthService {
  private httpHeaders: HttpHeaders;
  private userProfileSubject: BehaviorSubject<Profile>;
  public userProfile: Observable<Profile>;

  private isLoggedIn = false;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router,
  ) {
    if (!this.isTokenExpired()) {
      const profile = JSON.parse(localStorage.getItem('profile'));
      this.userProfileSubject = new BehaviorSubject<Profile>(profile);
      this.userProfile = this.userProfileSubject.asObservable();
      this.isLoggedIn = true;
    } else {
      this.userProfileSubject = new BehaviorSubject<Profile>(null);
      this.userProfile = this.userProfileSubject.asObservable();
    }
  }

  get(name: string) {
    return this.cookieService.get(name);
  }

  set(name: string, value: string, path?: string) {
    if (!path) {
      path = '/';
    }
    this.cookieService.set(name, value, {path: path});
  }

  remove(name: string, path?: string) {
    if (!path) {
      path = '/';
    }
    this.cookieService.delete(name, path);
  }

  login(token, uid, profile) {
    profile['jwtToken'] = token;
    this.userProfileSubject.next(profile);

    this.isLoggedIn = true;
  }

  logout() {
    this.userProfileSubject.next(null);
    localStorage.removeItem('profile');
    this.remove('access');
    this.remove('refresh');
    this.isLoggedIn = false;
    this.router.navigate(['account/login']);
  }

  public get profileValue(): Profile {
    return this.userProfileSubject.value;
  }

  public get token() {
    return this.profileValue.jwtToken;
  }

  public get uid() {
    return this.profileValue.jwtToken;
  }

  isAuthenticated() {
    return this.isLoggedIn;
  }

  getTokenExpirationDate(token: string): Date {
    const tokenDecoded = jwt_decode(token);
    if (tokenDecoded.exp === undefined) {
      return null;
    }
    const date = new Date(0);
    date.setUTCSeconds(tokenDecoded.exp);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    if (!token) {
      token = this.get('access');
    }
    if (!token) {
      return true;
    }
    const date = this.getTokenExpirationDate(token);
    if (date === undefined) {
      return false;
    }
    return !(date.valueOf() > new Date().valueOf());

  }
}
