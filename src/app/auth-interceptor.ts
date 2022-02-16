import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private backendService: BackendService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.info('IMINSIDEINTERCEPTIMINSIDEINTERCEPTIMINSIDEINTERCEPTIMINSIDEINTERCEPTIMINSIDEINTERCEPTIMINSIDEINTERCEPTIMINSIDEINTERCEPTIMINSIDEINTERCEPT')
    // Get the auth token from the service.
    const authToken = this.backendService.loggedUser.accessToken

    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('x-access-token', authToken)
    });

    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}