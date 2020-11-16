import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  API_PROFILE_URL = 'http://localhost:8081/profile/';

  private httpHeaders: HttpHeaders;
  private params: HttpParams;


  constructor(private http: HttpClient) {  }

  getAllProfiles(): Observable<any> {
    return this.http.get<any>(this.API_PROFILE_URL + 'all', {observe: 'response'});
  }

  findWhereNameOrSurnameLike(searchedValue: string): Observable<any> {
    return this.http.get<any>(this.API_PROFILE_URL + 'searchProfile?searchedValue=' + searchedValue, {observe: 'response'});
  }
  getProfile(profileId: number): Observable<any> {
    return this.http.get<any>(this.API_PROFILE_URL + '?id='  + profileId, {observe: 'response'});
  }
  getFamilyForProfile(profileId: number): Observable<any> {
    return this.http.get<any>(this.API_PROFILE_URL + 'family/?id='  + profileId, {observe: 'response'});
  }
}
