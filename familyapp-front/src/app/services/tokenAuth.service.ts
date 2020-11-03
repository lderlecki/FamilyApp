import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Profile} from '../models/profile';
import * as jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root',
})
export class TokenAuthService {
  private httpHeaders: HttpHeaders;
  private currentUserProfileSubject: BehaviorSubject<Profile>;
  private currentProfile: Observable<Profile>;

  private isLoggedIn = false;
  private token: string;
  private uid: number;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    if (!this.isTokenExpired()) {
      this.uid = JSON.parse(localStorage.getItem('profile')).id;
      this.token = this.get('access');
      this.isLoggedIn = true;
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

  login(token, uid) {
    this.token = token;
    this.isLoggedIn = true;
    this.uid = uid;
  }

  logout() {
    localStorage.removeItem('profile');
    this.remove('access');
    this.remove('refresh');
    this.token = null;
    this.isLoggedIn = false;
    this.uid = null;
  }

  getToken() {
    return this.token;
  }

  getUid() {
    return this.uid;
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
