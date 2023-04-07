import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SellerService } from '../services/seller.service';
import { UserService } from '../services/user.service';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  headerMenuType = 'default';
  sellerName = '';
  UserName = '';
  cartItem = 0;

  constructor(
    private route: Router,
    private sellerService: SellerService,
    private userService: UserService,
    private productService: ProductsService
  ) {}

  ngOnInit(): void {
    this.route.events.subscribe((path: any) => {
      if (path.url) {
        if (localStorage.getItem('seller') && path.url.includes('seller')) {
          if (localStorage.getItem('seller')) {
            let data = localStorage.getItem('seller');
            let sName = data && JSON.parse(data)[0];
            this.sellerName = sName.name;
            this.headerMenuType = 'seller';
          }
        } else if (localStorage.getItem('user')) {
          let userStore = localStorage.getItem('user');
          let userData = userStore && JSON.parse(userStore);
          this.UserName = userData.name;
          this.headerMenuType = 'user';
          this.productService.getCartList(userData.id);
        } else {
          this.headerMenuType = 'default';
        }
      }
    });

    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      this.cartItem = JSON.parse(cartData).length;
    }

    this.productService.cartData.subscribe((res) => {
      this.cartItem = res.length;
    });
  }

  logout() {
    this.sellerService.logout();
    this.route.navigate(['/']);
  }

  userLogout() {
    this.userService.userlogout();
    this.route.navigate(['user-auth']);
    this.productService.cartData.emit([]);
  }

  searcInput(value: string) {
    this.route.navigate([`search/${value}`]);
  }
}
