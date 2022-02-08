import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authSrv: AuthService, private router: Router){}
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const currentUser = this.authSrv.currentUser;
      if(currentUser){
        //check if the route is retricted by role
        if(next.data.roles && next.data.roles.indexOf(currentUser.role) === -1){
          //role not authorized
          this.router.navigate(["/metro"]);
          return false;

        }else{
          return true;
        }
      }
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/inicio'], { queryParams: { returnUrl: state.url } });
      return false;

    }
  
}
