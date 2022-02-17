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
    const url: string = state.url;

    return this.checkLogin(url.toLowerCase());
  }

  checkLogin(url: string): true | UrlTree {
    const loggedUserRole =
      this.backendService.loggedUser.roles &&
      this.backendService.loggedUser.roles[0]
        ? this.backendService.loggedUser.roles[0].toLowerCase()
        : '';
    const storageUser = localStorage.getItem('user');
    const storageUserRole = storageUser
      ? JSON.parse(storageUser).roles[0].toLowerCase()
      : '';

    if (
      (storageUserRole.includes('patient') && url.includes('patient')) ||
      (storageUserRole.includes('admin') && url.includes('admin')) ||
      (storageUserRole.includes('medic') && url.includes('medic'))
    ) {
      return true;
    }

    // Store the attempted URL for redirecting
    this.backendService.redirectUrl = url;

    // Redirect to the login page
    return this.router.parseUrl('/login');
  }
}
