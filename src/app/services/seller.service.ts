import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { login, signUp } from 'src/models/data-type';

@Injectable({
  providedIn: 'root',
})
export class SellerService {
  apiUrl = 'http://192.168.100.84:3003/seller';
  isSellerLoggedIn = new BehaviorSubject<boolean>(false);
  isLoginError = new EventEmitter<boolean>(false);
  isSingupError = new EventEmitter<boolean>(false);

  constructor(private http: HttpClient, private route: Router) {}

  userSingUp(data: signUp) {
    return this.http
      .post(this.apiUrl, data, { observe: 'response' })
      .pipe(catchError(this.handleError))
      .subscribe((result) => {
        if (result && result.body === 1) {
          this.isSellerLoggedIn.next(true);
          localStorage.setItem('seller', JSON.stringify(result.body));
          this.route.navigate(['seller-home']);
        } else {
          this.isSingupError.emit(true);
        }
      });
  }

  userLogin(data: login) {
    return this.http
      .get(this.apiUrl + `?email=${data.email}&password=${data.password}`, {
        observe: 'response',
      })
      .pipe(catchError(this.handleError))
      .subscribe((result: any) => {
        if (result && result.body && result.body.length === 1) {
          alert('User Login');
          localStorage.setItem('seller', JSON.stringify(result.body));
          this.route.navigate(['seller-home']);
        } else {
          // alert('Login Failed');
          this.isLoginError.emit(true);
        }
      });
  }

  reloadSeller() {
    if (localStorage.getItem('seller')) {
      this.isSellerLoggedIn.next(true);
      this.route.navigate(['seller-home']);
    }
  }

  logout() {
    localStorage.removeItem('seller');
  }

  // Error
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
