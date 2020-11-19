import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

import {TokenAuthService} from '../services/tokenAuth.service';
import {SpinnerService} from "../services/spinner.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: TokenAuthService, private spinnerService: SpinnerService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinnerService.requestStarted();

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
              // auto logout if 401 response returned from api
              console.log('interceptor error: ', error);
              this.authService.logout();
              location.reload();
            }
            this.spinnerService.resetSpinner();
            return throwError(error);
          }
        )
      );


    // return next.handle(request).pipe(catchError(err => {
    //       if ([401, 403].includes(err.status) && this.authService.profileValue) {
    //           // auto logout if 401 response returned from api
    //           this.authService.logout();
    //           location.reload();
    //       }
    //       return throwError(err);
    //   }));
  }
}
