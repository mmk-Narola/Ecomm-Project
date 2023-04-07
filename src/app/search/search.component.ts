import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { product } from 'src/models/data-type';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchResult: undefined | product[];

  constructor(
    private activeRoute: ActivatedRoute,
    private productServices: ProductsService
  ) {}

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((param) => {
      let query = param.get('query');
      this.productServices.searchProduct(query).subscribe((res: product[]) => {
        console.log('Search Result:>> ', res);
        this.searchResult = res;
      });
    });
  }
}
