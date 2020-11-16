import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Family} from '../models/family';
import {TokenAuthService} from './tokenAuth.service';
import {Profile} from "../models/profile";

@Injectable({
  providedIn: 'root'
})
export class FamilyService {
  // private familySubject: Subject<Family> = new BehaviorSubject<Family>(null);
  private familySubject: BehaviorSubject<Family>;
  private family: Observable<Family>;
  API_FAMILY_URL = 'http://localhost:8081/family/';

  constructor(private http: HttpClient, private authService: TokenAuthService) {
    const family = authService.profileValue.family;
    console.log('profile family: ', family);
    if (family !== null) {
      this.familySubject = new BehaviorSubject<Family>(family);
    } else {
      this.familySubject = new BehaviorSubject<Family>(null);
    }
    this.family = this.familySubject.asObservable();
  }

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

  public get familyValue(): Family {
    return this.familySubject.value;
  }

  public get familyMembers(): Profile[] {
    return this.familyValue.familyMembers;
  }

}
