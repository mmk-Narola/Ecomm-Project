import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { cart, order } from 'src/models/data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  totalPrice: number | undefined;
  cartData: cart[] | undefined;
  orderMsg: string | undefined;

  constructor(private product: ProductsService, private route: Router) {}

  ngOnInit(): void {
    this.product.currentCart().subscribe((res) => {
      let price = 0;
      this.cartData = res;
      res.forEach((ele) => {
        price = price + +ele.price * +ele.quantity;
      });

      this.totalPrice = price + price / 10 + 100 - (price * 5) / 100;
      console.log('this.totalPrice :>> ', this.totalPrice);
    });
  }

  orderNow(data: { email: string; address: string; contact: string }) {
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    if (this.totalPrice) {
      let orderData: order = { ...data, totalPrice: this.totalPrice, userId };

      this.cartData.forEach((item) => {
        setTimeout(() => {
          item.id && this.product.deleteCartItem(item.id);
        }, 600);
      });

      this.product.orderNow(orderData).subscribe((res) => {
        if (res) {
          this.orderMsg = 'Orders Placed';

          setTimeout(() => {
            this.route.navigate(['my-orders']);
            this.orderMsg = undefined;
          }, 1000);
        }
      });
    }
  }
}
