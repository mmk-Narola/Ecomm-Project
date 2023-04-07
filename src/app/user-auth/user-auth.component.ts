import { Component, OnInit } from '@angular/core';
import { cart, login, product, signUp } from 'src/models/data-type';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.scss'],
})
export class UserAuthComponent implements OnInit {
  isLogin = false;
  authError = '';
  constructor(
    private userService: UserService,
    private router: Router,
    private productSer: ProductsService
  ) {}

  ngOnInit(): void {
    this.userService.reloadUser();
  }

  signUp(data: signUp) {
    this.userService.userSingUp(data);
  }

  login(data: login) {
    this.userService.userLogin(data);
    this.userService.invalidUserAuth.subscribe((result) => {
      console.warn(result);
      if (result) {
        this.authError = 'User not found';
      } else {
        this.localCartToRemoteCart();
      }
    });
  }

  SingUpLogin(type: string) {
    if (type === 'login') {
      this.isLogin = true;
    } else if (type === 'signup') {
      this.isLogin = false;
    } else {
      this.isLogin = false;
    }
  }

  localCartToRemoteCart() {
    let data = localStorage.getItem('localCart');
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    if (data) {
      let cartDataList: product[] = JSON.parse(data);

      cartDataList.forEach((product: product, index) => {
        let cardData: cart = {
          ...product,
          productId: product.id,
          userId,
        };

        delete cardData.id;
        setTimeout(() => {
          this.productSer.addToCart(cardData).subscribe((result) => {
            if (result) {
              console.warn('Item Stored in DB');
            }
          });
          if (cartDataList.length === index + 1) {
            localStorage.removeItem('localCart');
          }
        }, 500);
      });
    }

    setTimeout(() => {
      this.productSer.getCartList(userId);
    }, 2000);
  }
}
