import { Component } from '@angular/core';
import { SellerService } from './services/seller.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ecomm-Project';
  constructor(private sellerServeice: SellerService) {}
  ngOnInit(): void {
    this.sellerServeice.reloadSeller();
  }
}
