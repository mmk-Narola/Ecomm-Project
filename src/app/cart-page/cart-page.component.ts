import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { cart, priceSummary, product } from 'src/models/data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
})
export class CartPageComponent implements OnInit {
  cartDetails: undefined | cart[];
  priceSummary: priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0,
  };

  constructor(private productService: ProductsService, private route: Router) {}

  ngOnInit(): void {
    this.loadDetails();
  }

  loadDetails() {
    this.productService.currentCart().subscribe((res: cart[]) => {
      console.log('res :>> ', res);
      this.cartDetails = res;
      let price = 0;
      res.forEach((ele) => {
        price = price + +ele.price * +ele.quantity;
      });
      this.priceSummary.price = price;
      this.priceSummary.discount = (price * 5) / 100;
      this.priceSummary.tax = price / 10;
      this.priceSummary.delivery = 100;
      this.priceSummary.total =
        price + price / 10 + 100 - this.priceSummary.discount;
      console.warn(this.priceSummary);
      if (!this.cartDetails.length) {
        this.route.navigate(['/']);
      }
    });
  }

  checkout() {
    this.route.navigate(['checkout']);
  }

  removeToCart(cartId: number | undefined) {
    cartId &&
      this.cartDetails &&
      this.productService.removeTocartbyapi(cartId).subscribe((result) => {
        this.loadDetails();
      });
  }
}
