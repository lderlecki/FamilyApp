import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Family} from '../models/family';
import {Data} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ToDoService {
  API_FAMILY_URL = 'http://localhost:8081/todolist/';

  constructor(private http: HttpClient) {
  }

  getToDosForFamily(familyId: number): Observable<any> {
    return this.http.get<any>(this.API_FAMILY_URL + 'forFamily/?id=' + familyId, {observe: 'response'});
  }

}
