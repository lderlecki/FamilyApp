import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Family} from '../models/family';
import {Data} from '@angular/router';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  constructor(private http: HttpClient) {
  }
  uploadProfileImage(file: any): Observable<any> {
    return this.http.post('http://localhost:8081/profile/changeProfileImage', file, {observe: 'response'});
  }
  uploadFamilyImage(file: any): Observable<any> {
    return this.http.post('http://localhost:8081/family/addFamilyImage', file, {observe: 'response'});
  }

}
