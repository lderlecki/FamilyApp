import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';

import {TokenAuthService} from '../services/tokenAuth.service';
import {environment} from '../environments/environment';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {SpinnerService} from "../services/spinner.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: TokenAuthService, private spinnerService: SpinnerService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    console.log('handle response jwt interceptor');
    const token = this.authService.get('access');
    const isApiUrl = request.url.startsWith(environment.djangoApiUrl) || request.url.startsWith(environment.springApiUrl);
    if (!this.authService.isTokenExpired() && isApiUrl) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(catchError(err => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        console.log('Error 401 start');
        return this.handle401Error(request, next);
      } else {
        console.log('Throw error:', err);
        return throwError(err);
      }
    }));
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      console.log('start refreshing');
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.access);
          console.log('refreshed: ', token);
          return next.handle(this.addToken(request, token.access)).pipe(
            catchError((error: HttpErrorResponse) => {
              // If error after refreshing token then logout the user
              this.authService.logout();
              return throwError(error);
            })
          );
        }));
    } else {
      console.log('Token refreshing already in progress');
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(access => {
          console.log('token refreshed in sub-request:', access);
          return next.handle(this.addToken(request, access));
        }));
    }
  }
}
