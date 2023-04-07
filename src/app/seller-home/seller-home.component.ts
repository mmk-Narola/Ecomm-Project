import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { product } from 'src/models/data-type';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.scss'],
})
export class SellerHomeComponent implements OnInit {
  productList: undefined | product[];
  icon = faTrash;
  iconEdit = faEdit;
  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.list();
  }

  list() {
    this.productService.productList().subscribe((response) => {
      this.productList = response;
    });
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe((res) => {
      console.log('res :>> ', res);
      this.list();
    });
  }
}
