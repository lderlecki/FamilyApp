import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Family} from '../models/family';
import {Data} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FamilyService {
  private familySubject: Subject<Family> = new BehaviorSubject<Family>(null);
  API_FAMILY_URL = 'http://localhost:8081/family/';

  private httpHeaders: HttpHeaders;
  private params: HttpParams;
  private family: Family;



  constructor(private http: HttpClient) {  }

  getAllFamilies(): Observable<any> {
    console.log('fetching families');
    return this.http.get<any>(this.API_FAMILY_URL + 'all', {observe: 'response'});
  }
  getFamiliesWhereFamilyNameLike(searchedValue: string): Observable<any> {
    return this.http.get<any>(this.API_FAMILY_URL + 'searchFamily?searchedValue=' + searchedValue, {observe: 'response'});
  }


  sendFamilyData(family: Family) {
    this.familySubject.next(family);
  }
  getData() {
    return this.familySubject.asObservable();
  }
}
