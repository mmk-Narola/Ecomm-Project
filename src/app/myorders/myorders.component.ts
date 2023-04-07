import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { order } from 'src/models/data-type';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.scss'],
})
export class MyordersComponent implements OnInit {
  orderList: undefined | order[];
  constructor(private product: ProductsService) {}

  ngOnInit(): void {
    this.getOrderList();
  }

  cancelOrder(orderId: number | undefined) {
    orderId &&
      this.product.cancelOrder(orderId).subscribe((res) => {
        this.getOrderList();
      });
  }

  getOrderList() {
    this.product.orderList().subscribe((res: order[]) => {
      this.orderList = res;
    });
  }
}
