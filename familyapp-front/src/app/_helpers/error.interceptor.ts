import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, exhaustMap, filter, map, switchMap, take, tap} from 'rxjs/operators';

import {TokenAuthService} from '../services/tokenAuth.service';
import {SpinnerService} from "../services/spinner.service";
import {UserService} from "../services/user.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: TokenAuthService,
              private spinnerService: SpinnerService,
              private userService: UserService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinnerService.requestStarted();
    // console.log('error interceptor');
    return next.handle(request)
      .pipe(
        tap(
          (event) => {
            if (event instanceof HttpResponse) {
              this.spinnerService.requestEnded();
            }
          },
          (error: HttpErrorResponse) => {
            if ([401, 403].includes(error.status) && this.authService.profileValue) {
              this.authService.logout();
              location.reload();
            }
            this.spinnerService.resetSpinner();
            return throwError(error);
          }
        )
      );
  }

}
