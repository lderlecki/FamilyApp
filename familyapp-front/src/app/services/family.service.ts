import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FamilyService {
  API_FAMILY_URL = 'http://localhost:8081/family/';

  private httpHeaders: HttpHeaders;
  private params: HttpParams;


  constructor(private http: HttpClient) {  }

  getAllFamilies(): Observable<any> {
    console.log('fetching families');
    return this.http.get<any>(this.API_FAMILY_URL + 'all', {observe: 'response'});
  }
}
