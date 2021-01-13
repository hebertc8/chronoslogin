import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RequestsService } from '../requests.service';


@Injectable({
  providedIn: 'root'
})
export class ValidateLoginGuard implements CanActivate {
  constructor(private user: RequestsService, private router: Router ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.user.userInfo) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }

  }

}
