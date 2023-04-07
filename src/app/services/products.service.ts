import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { cart, order, product } from 'src/models/data-type';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  apiUrl = 'http://192.168.100.84:3003/';

  cartData = new EventEmitter<product[] | []>();
  constructor(private http: HttpClient, private route: Router) {}

  addProducts(data: product) {
    return this.http.post(this.apiUrl, data).pipe(catchError(this.handleError));
  }

  productList() {
    return this.http
      .get<product[]>(this.apiUrl + 'products')
      .pipe(catchError(this.handleError));
  }

  deleteProduct(id: number) {
    return this.http
      .delete(this.apiUrl + `products/${id}`)
      .pipe(catchError(this.handleError));
  }

  getProductbyId(id: string) {
    return this.http
      .get<product>(this.apiUrl + `products/${id}`)
      .pipe(catchError(this.handleError));
  }

  getProductbyCategory(category: string) {
    return this.http
      .get(this.apiUrl + `products?category=${category}`)
      .pipe(catchError(this.handleError));
  }

  // http://192.168.100.84:3003/products?category=Electronic

  updateProduct(id: string, data: product) {
    return this.http
      .put<product>(this.apiUrl + `products/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  limitedProductShow() {
    return this.http
      .get(this.apiUrl + 'products?_limit=5')
      .pipe(catchError(this.handleError));
  }

  searchProduct(query: string) {
    return this.http
      .get<product[]>(this.apiUrl + `products?category=${query}`)
      .pipe(catchError(this.handleError));
  }

  localAddToCart(data: product) {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]));
      this.cartData.emit([data]);
    } else {
      cartData = JSON.parse(localCart);
      cartData.push(data);
      localStorage.setItem('localCart', JSON.stringify(cartData));
      this.cartData.emit(cartData);
    }
  }

  removeItemfromCart(productId: number) {
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      let items: product[] = JSON.parse(cartData);
      items = items.filter((items: product) => productId !== items.id);
      localStorage.setItem('localCart', JSON.stringify(items));
      this.cartData.emit(items);
    }
  }

  addToCart(cartData: cart) {
    return this.http.post(this.apiUrl + 'cart', cartData);
  }

  getCartList(userId: number) {
    return this.http
      .get<product[]>(this.apiUrl + `cart?userId=${userId}`, {
        observe: 'response',
      })
      .pipe(catchError(this.handleError))
      .subscribe((result) => {
        //  console.error(result);
        if (result && result.body) {
          this.cartData.emit(result.body);
        }
      });
  }

  removeTocartbyapi(cardId: number) {
    return this.http
      .delete(this.apiUrl + `cart/${cardId}`)
      .pipe(catchError(this.handleError));
  }

  currentCart() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    // http://192.168.100.84:3003/cart?userId=2
    return this.http
      .get<cart[]>(this.apiUrl + `cart?userId=${userData.id}`)
      .pipe(catchError(this.handleError));
  }

  orderNow(data: order) {
    return this.http
      .post(this.apiUrl + 'orders', data)
      .pipe(catchError(this.handleError));
  }

  orderList() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<order[]>(this.apiUrl + `orders?userId=${userData.id}`);
  }

  deleteCartItem(cartId: number) {
    return this.http
      .delete(this.apiUrl + `cart/${cartId}`, { observe: 'response' })
      .pipe(catchError(this.handleError))
      .subscribe((result) => {
        if (result) {
          this.cartData.emit([]);
        }
      });
  }

  cancelOrder(orderId: number) {
    return this.http.delete(this.apiUrl + `orders/${orderId}`);
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
