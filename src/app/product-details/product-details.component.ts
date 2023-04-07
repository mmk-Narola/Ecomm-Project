import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { cart, product } from 'src/models/data-type';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  productData: undefined | product;
  productId: string;
  productQuantity = 1;
  removeCart = false;
  carData: undefined | product;
  CategoryProduct: undefined | product[];
  productCategory: undefined | string;

  display = true;

  constructor(
    private activeRoute: ActivatedRoute,
    private productService: ProductsService
  ) {}

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((param) => {
      this.productId = param.get('productId');
    });

    this.productService
      .getProductbyId(this.productId)
      .subscribe((res: product) => {
        this.productData = res;
        //Category Product
        this.productCategory = this.productData.category;
        console.log('this.productCategory :>> ', this.productCategory);
        this.productService
          .getProductbyCategory(this.productCategory)
          .subscribe((res: product[]) => {
            console.log('res :>> ', res);
            res = res.filter((item) => this.productId !== item.id.toString());
            if (res) {
              this.CategoryProduct = res;
            }
          });
        //

        let cartData = localStorage.getItem('localCart');
        if (this.productId && cartData) {
          let item = JSON.parse(cartData);
          item = item.filter(
            (item: product) => this.productId == item.id.toString()
          );
          if (item.length) {
            this.removeCart = true;
          } else {
            this.removeCart = false;
          }
        }

        let user = localStorage.getItem('user');

        if (user) {
          let userId = user && JSON.parse(user).id;
          this.productService.getCartList(userId);
          this.productService.cartData.subscribe((result) => {
            let item = result.filter(
              (item: product) =>
                this.productId?.toString() === item.productId?.toString()
            );

            if (item.length) {
              this.carData = item[0];
              this.removeCart = true;
            } else {
              this.removeCart = false;
            }
          });
        }
      });

    // this.productService
    //   .getProductbyCategory(this.productCategory)
    //   .subscribe((respo: product[]) => {
    //     // this.allProduct = respo;
    //     console.log('Caterogy Product :>> ', respo);
    //   });
  }

  handleQuantity(quantity: string) {
    if (this.productQuantity < 20 && quantity === 'plus') {
      this.productQuantity += 1;
    } else if (this.productQuantity > 1 && quantity === 'min') {
      this.productQuantity -= 1;
    }
  }

  AddToCart() {
    if (this.productData) {
      this.productData.quantity = this.productQuantity;
      if (!localStorage.getItem('user')) {
        this.productService.localAddToCart(this.productData);
        this.removeCart = true;
      } else {
        let user = localStorage.getItem('user');
        let userId = user && JSON.parse(user).id;
        console.warn(userId);
        let cartData: cart = {
          ...this.productData,
          userId,
          productId: this.productData.id,
        };

        delete cartData.id;
        this.productService.addToCart(cartData).subscribe((respo) => {
          if (respo) {
            this.productService.getCartList(userId);
            this.removeCart = true;
            console.warn('respo', respo);
          }
        });
      }
    }
  }

  RemoveToCart(productId: number) {
    if (!localStorage.getItem('user')) {
      this.productService.removeItemfromCart(productId);
    } else {
      console.log(this.carData);
      this.carData &&
        this.productService
          .removeTocartbyapi(this.carData.id)
          .subscribe((result) => {
            let user = localStorage.getItem('user');
            let userId = user && JSON.parse(user).id;
            if (result) {
              this.productService.getCartList(userId);
            }
          });
    }
    this.removeCart = false;
  }

  buyNow() {
    this.productId;
  }
}
