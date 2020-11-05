import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {TokenAuthService} from '../services/tokenAuth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authService: TokenAuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].includes(err.status) && this.authService.profileValue) {
                // auto logout if 401 response returned from api
                this.authService.logout();
                location.reload();
            }

            const error = err.error.message || err.statusText;
            console.log(error);
            return throwError(error);
        }));
    }
}
