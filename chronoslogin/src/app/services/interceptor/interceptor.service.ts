import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestsService } from '../requests.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private user: RequestsService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const currentUser = this.user.userInfo;


    if (currentUser) {

      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`,
          'Access-Control-Allow-Origin': '*',
        },
      });
      return next.handle(request);
    } else {
      return next.handle(request);
    }

  }
}

