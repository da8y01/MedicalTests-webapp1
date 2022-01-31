import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private backendService: BackendService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): true | UrlTree {
    console.log(`AuthGuard#canActivate called`);
    const url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): true | UrlTree {
    const loggedUserRole = this.backendService.loggedUser.roles && this.backendService.loggedUser.roles[0]
      ? this.backendService.loggedUser.roles[0].toLowerCase()
      : '';
    if (
      (loggedUserRole.includes('patient') &&
        url.toLowerCase().includes('patient')) ||
      (loggedUserRole.includes('medic') && url.toLowerCase().includes('medic'))
    ) {
      return true;
    }

    // Store the attempted URL for redirecting
    this.backendService.redirectUrl = url;

    // Redirect to the login page
    return this.router.parseUrl('/login');
  }
}
