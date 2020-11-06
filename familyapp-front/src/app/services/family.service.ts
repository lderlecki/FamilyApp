import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Family} from '../models/family';
import {Data} from '@angular/router';
import {Profile} from '../models/profile';
import {TokenAuthService} from "./tokenAuth.service";

@Injectable({
  providedIn: 'root'
})
export class FamilyService {
  private familySubject: Subject<Family> = new BehaviorSubject<Family>(null);
  API_FAMILY_URL = 'http://localhost:8081/family/';

  private httpHeaders: HttpHeaders;
  private params: HttpParams;
  private family: Observable<Family>;

  constructor(private http: HttpClient, private authService: TokenAuthService) {
    if (authService.profileValue.family !== null) {
      this.familySubject.next(this.authService.profileValue.family);
      this.family = this.familySubject.asObservable();
    }
  }

  getAllFamilies(): Observable<any> {
    console.log('fetching families');
    return this.http.get<any>(this.API_FAMILY_URL + 'all', {observe: 'response'});
  }

  sendFamilyData(family: Family) {
    this.familySubject.next(family);
  }

  getData() {
    return this.familySubject.asObservable();
  }

  // public get familyValue(): Family {
  //   return this.familySubject.value;
  // }

  public get members(): boolean {
    console.log('family get data');
    console.log(this.getData());
    return true;
  }
}
