import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Family} from '../models/family';
import {TokenAuthService} from './tokenAuth.service';
import {Profile} from "../models/profile";
import {environment} from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FamilyService {
  // private familySubject: Subject<Family> = new BehaviorSubject<Family>(null);
  private familySubject: BehaviorSubject<Family>;
  private family: Observable<Family>;
  API_FAMILY_URL = 'http://localhost:8081/family/';
  API_DJANGO_URL = environment.djangoApiUrl;

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

  createFamily(data) {
    return this.http.post<Family>(this.API_DJANGO_URL + 'family/create/', data);
  }

  public get familyValue(): Family {
    return this.familySubject.value;
  }

  public get familyMembers(): Profile[] {
    return this.familyValue.familyMembers;
  }

  getFamilyImages(): Observable<any> {
    return this.http.get(
      this.API_FAMILY_URL + 'getFamilyImages',
      { responseType: 'json', observe: 'response' });
  }
  deleteFamilyImage(familyImageId: number){
    return this.http.delete(this.API_FAMILY_URL + 'deleteFamilyImage?id=' + familyImageId, {observe: 'response'});
  }

}
