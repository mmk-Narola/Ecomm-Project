import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { product } from 'src/models/data-type';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.scss'],
})
export class SellerAddProductComponent implements OnInit {
  addProuctMessage = '';
  productId: string;
  isEditMode!: boolean;

  productForm: FormGroup;

  constructor(
    private productService: ProductsService,
    private route: Router,
    private activeRoute: ActivatedRoute,
    private formbuilder: FormBuilder
  ) {
    this.productForm = this.formbuilder.group({
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((param) => {
      this.productId = param.get('id');
      if (this.productId) {
        this.isEditMode = true;
      }
    });

    if (this.isEditMode) {
      this.getProductById(this.productId);
    }
  }

  get f() {
    return this.productForm.controls;
  }

  onSubmit() {
    if (this.productForm.invalid) {
      let r = (this.addProuctMessage = 'All Field Required');
      setTimeout(() => {
        this.addProuctMessage = undefined;
      }, 2000);
      return;
    }

    this.isEditMode ? this.UpdateProduct() : this.AddProduct();
  }

  getProductById(id: string) {
    this.productService.getProductbyId(id).subscribe((res: product): void => {
      console.log('res :>> ', res);
      this.productForm.patchValue({
        name: res.name,
        price: res.price,
        category: res.category,
        description: res.description,
        image: res.image,
      });
    });
  }

  AddProduct() {
    let data: product = this.productForm.value;
    this.productService.addProducts(data).subscribe((res) => {
      if (res) {
        this.addProuctMessage = 'Product Successfully Added';
        setTimeout(() => {
          this.addProuctMessage = undefined;
        }, 2000);
      }
      this.route.navigate(['seller-home']);
    });
  }

  UpdateProduct() {
    let data: product = this.productForm.value;
    this.productService
      .updateProduct(this.productId, data)
      .subscribe((res: product) => {
        console.log('Res', res);
        this.route.navigate(['seller-home']);
      });
  }
}
