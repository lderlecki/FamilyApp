import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Family} from '../models/family';
import {Data} from '@angular/router';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ToDoService {
  API_FAMILY_URL = 'http://localhost:8081/todolist/';
  API_URL_DJANGO = environment.djangoApiUrl;

  constructor(private http: HttpClient) {
  }

  getToDosForFamily(): Observable<any> {
    return this.http.get<any>(this.API_FAMILY_URL + 'forFamily', {observe: 'response'});
  }

  changeTaskStatus(taskId: number, status: boolean): Observable<any> {
    return this.http.patch(this.API_URL_DJANGO + `tasks/${taskId}/` , {'done': !status});
  }

  createTask(taskData): Observable<any> {
    return this.http.post(this.API_URL_DJANGO + 'tasks/', taskData);
  }

  createTodolist(todoData): Observable<any> {
    return this.http.post(this.API_URL_DJANGO + 'todo/create/', todoData, {observe: 'response'});
  }

}
