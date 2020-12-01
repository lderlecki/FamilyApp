import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  API_INVITATION_URL = 'http://localhost:8081/invitation/';

  private httpHeaders: HttpHeaders;
  private params: HttpParams;


  constructor(private http: HttpClient) {  }

  getInvitationsForFamily(): Observable<any> {
    return this.http.get<any>(this. API_INVITATION_URL + 'family', {observe: 'response'});
  }
  getInvitationsForProfile(): Observable<any> {
    return this.http.get<any>(this. API_INVITATION_URL + 'profile', {observe: 'response'});
  }
  sendInvitation(body: any): Observable<any> {
    return this.http.post(this. API_INVITATION_URL, body, {observe: 'response'});
  }
  rejectInvitation(invitationId: number): Observable<any> {
    return this.http.delete(this. API_INVITATION_URL + '?id=' + invitationId,  {observe: 'response'});
  }
  acceptInvitation(invitationId: number): Observable<any> {
    return this.http.delete(this. API_INVITATION_URL + 'accept/?id=' + invitationId,  {observe: 'response'});
  }
}
