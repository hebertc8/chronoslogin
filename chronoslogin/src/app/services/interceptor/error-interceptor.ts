import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { RequestsService } from '../requests.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private user: RequestsService, private toastr: NbToastrService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    return next.handle(request).pipe(catchError(err => {

      try {
        if (err.error.code === 401) {
          this.toastr.warning('Sesión expirada', 'Sesión');
          setTimeout(() => {
            this.user.logout();
            this.router.navigate(['/login']);
          }, 1000);
        } else {
          this.toastr.warning(err.name, 'Error');
        }
      } catch (error) {
        this.toastr.warning(err.name, 'Error');
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
